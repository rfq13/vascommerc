import {
  DUMMY_EMAIL,
  MAIL_PASSWORD,
  MAIL_USERNAME,
  JWT_ACCESS_TOKEN_EXPIRED,
} from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import SessionService from '@controllers/Session/service'
import userSchema from '@controllers/User/schema'
import UserService from '@controllers/User/service'
import User, {
  LoginAttributes,
  UserAttributes,
  UserLoginAttributes,
  ForgotPasswordAttributes,
  VerifyTokenForgotPasswordAttributes,
  ResetPasswordAttributes,
  RefreshTokenAttributes,
} from '@database/entities/User'
import ConstRole from '@vscommerce/constants/ConstRole'
import { validateEmpty } from '@vscommerce/helpers/Formatter'
import SendMail from '@vscommerce/helpers/SendMail'
import {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
} from '@vscommerce/helpers/Token'
import { ReqOptions } from '@vscommerce/interfaces/ReqOptions'
import ResponseError from '@vscommerce/modules/Response/ResponseError'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { Op, Transaction } from 'sequelize'
import Session from '@database/entities/Session'
import * as bcrypt from 'bcrypt'
import userAgentHelper from '@vscommerce/helpers/userAgent'
import Role from '@database/entities/Role'
import { v4 as uuidv4 } from 'uuid'

const RoleIds = {
  user: ConstRole.ID_USER,
  admin: ConstRole.ID_ADMIN,
  superAdmin: ConstRole.ID_SUPER_ADMIN,
}

interface DtoLogin {
  message: string
  data: {
    needOtpValidation?: boolean | null | undefined
    otp?: string | null | undefined
    tokenType: string
    user: {
      uid: string
    }
    accessToken: string
    expiresIn: number
    refreshToken: string
  }
}

enum codeCheck {
  USER = 'user',
  SESSION = 'session',
}
interface TokenPayload {
  uid: string
  role: string
  isSuper?: boolean
}

class AuthService {
  /**
   *
   * @param formData
   * @returns
   */

  // verify otp sign in
  public static async verifyOtpSignIn(
    formData: LoginAttributes,
    options?: ReqOptions
  ): Promise<any> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.verifyotp.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const session = await SessionService.findByToken(value.token, undefined, [
      'id',
      'otp',
      'UserId',
    ])

    if (!session) {
      const message = i18nConfig.t('errors.session_not_found', i18nOpt)
      throw new ResponseError.Unauthorized(message)
    }

    if (session.otp !== value.otp) {
      const message = i18nConfig.t('errors.otp_not_match', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    await session.update({ otp: null })

    // find user
    const user = await User.findOne({
      where: { id: session.UserId },
      attributes: ['password', 'pin'],
    })

    return {
      id: session.id,
      otp: session.otp,
      UserId: session.UserId,
      passwordNeeded: !user?.password,
    }
  }

  // generate uniq random code
  public static async generateRandomCode(
    type: codeCheck = codeCheck.USER
  ): Promise<number> {
    const randCode = Math.floor(1000 + Math.random() * 9000)
    let check

    if (type === codeCheck.USER) {
      check = await User.findOne({
        where: { tokenVerify: randCode },
        attributes: ['id'],
      })
    } else {
      check = await Session.findOne({
        where: { otp: randCode },
        attributes: ['id'],
      })
    }

    if (check) {
      return await this.generateRandomCode(type)
    }

    return randCode
  }

  public static async signUp(
    formData: UserAttributes,
    role: keyof typeof RoleIds = 'user',
    txn?: Transaction
  ): Promise<any> {
    // generate 4 digit random number
    const randomCode =
      formData?.email !== DUMMY_EMAIL ? await this.generateRandomCode() : 8888

    const roleId = RoleIds[role] ?? ConstRole.ID_USER

    const newFormData = {
      ...formData,
      tokenVerify: randomCode,
      RoleId: roleId,
    }

    const value = userSchema.register.validateSync(newFormData, {
      abortEarly: false,
      stripUnknown: true,
    })

    // check if email or number already exist
    const checkUser = await User.findOne({
      where: { [Op.or]: [{ email: value.email }, { phone: value.phone }] },
      attributes: ['id'],
    })

    if (checkUser) {
      if (value.email !== DUMMY_EMAIL) {
        throw new ResponseError.BadRequest('Email or phone already exist')
      } else {
        void checkUser.update({
          email: value.email,
          tokenVerify: '8888',
          transaction: txn,
        })
      }
    }

    const formRegistration = {
      ...value,
      phone: validateEmpty(formData.phone),
      password: value.password,
      isActive: 0,
    }

    if (ConstRole.ROLE_ADMIN.includes(role)) {
      formRegistration.isActive = 1
    }

    let newData
    if (value.email !== DUMMY_EMAIL) {
      newData = await User.create(formRegistration, {
        transaction: txn,
      })
    } else {
      newData = await User.upsert(formRegistration, {
        fields: ['email'],
        returning: true,
        transaction: txn,
      })
    }

    // check if exist mail_username & mail_password
    if (
      !ConstRole.ROLE_ADMIN.includes(role) &&
      MAIL_USERNAME &&
      MAIL_PASSWORD
    ) {
      // send verification code via taptalk first, if failed then send via email
      // use http request to send verification code
      void this.sendOtpVerification({
        email: value.email,
        randCode: randomCode,
        fullName: value.fullName,
        phone: value.phone,
      })
    }

    return newData
  }

  public static async sendOtpVerification(
    fromData: any,
    resend = false
  ): Promise<any> {
    let user = null
    const value = userSchema.sendotp.validateSync(fromData, {
      abortEarly: false,
      stripUnknown: true,
    })

    let randomCode = value?.randCode
    if (resend) {
      const newRandCode = await this.generateRandomCode()
      randomCode = newRandCode

      const orCondition = [] as any

      if (value.phone) {
        orCondition.push({ phone: value.phone })
      }

      if (value.email) {
        orCondition.push({ email: value.email })
      }

      if (orCondition.length === 0) {
        throw new ResponseError.BadRequest('errors.email_or_phone_required')
      }

      user = await User.findOne({
        where: { [Op.or]: orCondition },
      })

      if (!user) {
        throw new ResponseError.BadRequest('User not found')
      }

      // if user.phone is null, then update user.phone with value.phone
      if (!user.phone && value.phone) {
        user.phone = value.phone
      }

      // if user.email !== value.email or user.phone !== value.phone
      // if (
      //   (value.email && user.email !== value.email) ||
      //   (value.phone && user.phone !== value.phone)
      // ) {
      //   throw new ResponseError.BadRequest('User not found')
      // }

      user.tokenVerify = randomCode.toString()
      await user.save()

      if (!value.fullName) {
        value.fullName = user.fullName
      }
    }

    const sendwa = {
      data: {
        status: 201,
      },
    } as any

    if (randomCode && sendwa.status !== 'success') {
      SendMail.AccountRegistration({
        email: value.email ?? '',
        fullName: value.fullName ?? '',
        token: randomCode.toString(),
      })
    }

    return {
      status: 'success',
      message: 'OTP has been sent',
      sendwa: JSON.stringify(sendwa),
    }
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async signIn(
    getUser: User,
    options?: ReqOptions,
    exp: string = JWT_ACCESS_TOKEN_EXPIRED
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const payloadToken: TokenPayload = { uid: getUser.id, role: getUser.RoleId }
    const accessToken = generateAccessToken(payloadToken, false, exp)
    const refreshToken = generateRefreshToken(payloadToken)

    const otpData = {
      email: getUser.email,
      randCode: undefined,
      phone: getUser.phone,
      fullName: getUser.fullName,
    } as any

    if (getUser.email !== DUMMY_EMAIL) {
      otpData.randCode = (await this.generateRandomCode()).toString()

      console.log('otpData ===> ', otpData)

      await this.sendOtpVerification(otpData)
    }

    const message = i18nConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      data: {
        ...accessToken,
        refreshToken,
        tokenType: 'Bearer',
        user: { ...payloadToken, isTest: getUser.email !== DUMMY_EMAIL },
        otp: otpData?.randCode,
      },
    }

    if (options?.req) {
      void SessionService.save({
        UserId: newData.data.user.uid as unknown as string,
        token: newData.data.accessToken,
        ipAddress: options?.req.clientIp?.replace('::ffff:', ''),
        device: userAgentHelper.currentDevice(options.req),
        platform: userAgentHelper.currentPlatform(options.req),
      })
    }

    return newData
  }

  /**
   *
   * @param formData
   * @returns
   */

  // this function only for user who not set password yet
  public static async setPassword(
    user: User,
    formData: LoginAttributes,
    options?: ReqOptions
  ): Promise<string> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.setPassword.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (user.password) {
      const message = i18nConfig.t('errors.password_already_set', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    // update pin
    await user.update({ password: value.password })

    const message = i18nConfig.t('success.password_set', i18nOpt)

    return message
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async signInAdmin(
    formData: LoginAttributes,
    options?: ReqOptions,
    exp?: string
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.login.validateSync(
      { ...formData },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    )

    const getUser = await User.scope('withPassword').findOne({
      where: { email: value.email },
    })

    // check user account
    if (!getUser) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    if (ConstRole.ID_USER === getUser.RoleId) {
      const message = i18nConfig.t('errors.permission_access', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    const matchPassword = await getUser.comparePassword(value.password)

    // compare password
    if (!matchPassword) {
      const message = i18nConfig.t('errors.incorrect_email_or_pass', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const payloadToken: TokenPayload = {
      uid: getUser.id,
      role: getUser.RoleId,
      isSuper: getUser.RoleId === ConstRole.ID_SUPER_ADMIN,
    }
    const accessToken = generateAccessToken(payloadToken, false, exp)
    const refreshToken = generateRefreshToken(payloadToken)

    const message = i18nConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      data: {
        ...accessToken,
        refreshToken,
        tokenType: 'Bearer',
        user: { ...payloadToken, isTest: getUser.email !== DUMMY_EMAIL },
      },
    }

    if (options?.req) {
      void SessionService.save({
        UserId: newData.data.user.uid as unknown as string,
        token: newData.data.accessToken,
        ipAddress: options.req.clientIp?.replace('::ffff:', ''),
        device: userAgentHelper.currentDevice(options.req),
        platform: userAgentHelper.currentPlatform(options.req),
      })
    }

    return newData
  }

  /**
   *
   * @param UserId
   * @param token
   * @param options
   * @returns
   */
  public static async verifySession(
    UserId: string,
    token: string,
    options?: ReqOptions
  ): Promise<User | null> {
    const getSession = await SessionService.findByUserToken(UserId, token)
    const verifyToken = verifyAccessToken(getSession.token)

    const userToken = verifyToken?.data as UserLoginAttributes

    if (!_.isEmpty(userToken.uid)) {
      const getUser = await UserService.findById(userToken.uid, { ...options })

      return getUser
    }

    return null
  }

  /**
   * @param formData
   * @param options
   * @returns
   */

  public static async refreshToken(
    formData: RefreshTokenAttributes,
    options?: ReqOptions
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.refreshToken.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    // verify refresh token
    const verifyToken = verifyAccessToken(value.refreshToken)
    const verifyOldToken = verifyAccessToken(value.oldToken)

    if (!verifyToken) {
      const message = i18nConfig.t('errors.invalid_token', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    if (!verifyOldToken) {
      const message = i18nConfig.t('errors.invalid_old_token', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const payloadToken = verifyToken.data as UserLoginAttributes

    // check user account
    if (!payloadToken?.uid) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound('JWT Expired Error:' + message)
    }
    const accessToken = generateAccessToken({
      uid: payloadToken.uid,
      role: payloadToken.role,
    })

    void SessionService.updateByToken(value.oldToken, accessToken.accessToken)

    const message = i18nConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      data: {
        ...accessToken,
        refreshToken: value.refreshToken,
        tokenType: 'Bearer',
        user: payloadToken,
      },
    }

    return newData
  }

  /**
   *
   * @param UserId
   * @param token
   * @param options
   * @returns
   */
  public static async logout(
    UserId: string,
    token: string,
    options?: ReqOptions
  ): Promise<string> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const getUser = await UserService.findById(UserId, { ...options })

    // clean session
    await SessionService.deleteByUserToken(getUser.id, token)
    const message = i18nConfig.t('success.logout', i18nOpt)

    return message
  }

  // make email verification
  public static async emailVerification(
    token: string,
    options?: ReqOptions
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.token.validateSync(
      { token },
      { abortEarly: false }
    )

    const getUser = await User.findOne({
      where: { tokenVerify: value.token },
      // include: including,
    })

    console.log({ getUser, value })

    if (!getUser) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    // if (getUser.isActive) {
    //   const message = i18nConfig.t('errors.account_already_verified', i18nOpt)
    //   throw new ResponseError.BadRequest(message)
    // }

    const updateData = {
      isActive: true,
      tokenVerify: null,
    }

    await getUser.update(updateData)

    const payloadToken: TokenPayload = { uid: getUser.id, role: getUser.RoleId }
    const accessToken = generateAccessToken(payloadToken, false)
    const refreshToken = generateRefreshToken(payloadToken)

    const message = i18nConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      data: {
        ...accessToken,
        refreshToken,
        tokenType: 'Bearer',
        user: { ...payloadToken, isTest: getUser.email !== DUMMY_EMAIL },
      },
    }

    return newData
  }

  // make forgot password
  public static async forgotPassword(
    formData: ForgotPasswordAttributes,
    options?: ReqOptions
  ): Promise<string> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.forgotPassword.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const orCondition = []

    if (value.email) {
      orCondition.push({ email: value.email })
    }

    if (value.phone) {
      orCondition.push({ phone: value.phone })
    }

    if (orCondition.length === 0) {
      const message = i18nConfig.t('errors.email_or_phone_required', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const getUser = await User.findOne({
      where: {
        [Op.or]: orCondition,
      },
    })

    // check user account
    if (!getUser) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    // generate token
    // const randomToken = generateAccessToken({ uuid: uuidv4() })
    const randomCode = await this.generateRandomCode()

    // update token
    await User.update(
      { tokenVerify: randomCode },
      { where: { id: getUser.id } }
    )

    // check if exist mail_username & mail_password
    if (MAIL_USERNAME && MAIL_PASSWORD) {
      if (getUser.phone) {
        SendMail.ForgotPassword({
          email: getUser.email,
          token: randomCode.toString(),
          fullName: getUser?.fullName ?? '',
        })
      }
    }

    const message = i18nConfig.t('success.forgot_password', i18nOpt)

    return message
  }

  // verify token forgot password
  public static async verifyTokenForgotPassword(
    formData: VerifyTokenForgotPasswordAttributes,
    options?: ReqOptions
  ): Promise<string> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.verifyTokenForgotPassword.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const orCondition = []

    if (value.email) {
      orCondition.push({ email: value.email })
    }

    if (value.phone) {
      orCondition.push({ phone: value.phone })
    }

    if (orCondition.length === 0) {
      const message = i18nConfig.t('errors.email_or_phone_required', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const getUser = await User.findOne({
      // where: {
      //   email: value.email,
      //   phone: value.phone,
      // },
      where: {
        [Op.or]: orCondition,
        tokenVerify: value.token,
        isActive: true,
      },
    })

    // check user account
    if (!getUser) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    const message = i18nConfig.t(
      'success.verify_token_forgot_password',
      i18nOpt
    )

    return message
  }

  // reset password
  public static async resetPassword(
    formData: ResetPasswordAttributes,
    options?: ReqOptions
  ): Promise<string> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.resetPassword.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const orCondition = []

    if (value.email) {
      orCondition.push({ email: value.email })
    }

    if (value.phone) {
      orCondition.push({ phone: value.phone })
    }

    if (orCondition.length === 0) {
      const message = i18nConfig.t('errors.email_or_phone_required', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    // update password
    const updatePw = await User.update(
      { password: validateEmpty(value?.password), tokenVerify: null },
      {
        where: {
          tokenVerify: value.token,
          isActive: true,
          [Op.or]: orCondition,
        },
        individualHooks: true,
      }
    )

    // check user account
    if (updatePw[0] === 0) {
      const message = i18nConfig.t('errors.account_not_found', i18nOpt)
      throw new ResponseError.NotFound(message)
    }

    const message = i18nConfig.t('success.reset_password', i18nOpt)

    return message
  }

  // user deletion
  public static async deleteUser(
    user: User,
    formData: object,
    token: string,
    options?: ReqOptions
  ): Promise<any> {
    try {
      const i18nOpt: string | TOptions = { lng: options?.lang }

      await UserService.forceDelete(user.id)

      const message = i18nConfig.t('success.delete_user', i18nOpt)

      return { message }
    } catch (error: any) {
      throw new ResponseError.BadRequest(error.message)
    }
  }

  public static async generateHash(password: string): Promise<string> {
    return bcrypt.hashSync(password, 10)
  }

  public static async socialLogin(
    formData: UserAttributes,
    options?: ReqOptions
  ): Promise<DtoLogin> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const value = userSchema.socialLogin.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })
    // console.log('formData ===> ', formData)
    // const value = formData as any

    let getUser = await User.findOne({
      where: { email: value._json.email },
      include: [{ model: Role }],
    })

    if (!getUser) {
      // create new user
      const newUserToken: TokenPayload = {
        uid: uuidv4(),
        role: ConstRole.ID_USER,
      }
      const randomToken = generateAccessToken(newUserToken)

      const newFormData = {
        email: value._json.email,
        fullName: value.displayName,
        tokenVerify: randomToken.accessToken,
        RoleId: ConstRole.ID_USER,
        phone: '',
        isActive: value._json.email_verified,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      getUser = await User.create(newFormData)
    }

    const payloadToken: TokenPayload = { uid: getUser.id, role: getUser.RoleId }
    const accessToken = generateAccessToken(payloadToken)
    const refreshToken = generateRefreshToken(payloadToken)

    const message = i18nConfig.t('success.login', i18nOpt)

    const newData = {
      message,
      data: {
        ...accessToken,
        refreshToken,
        tokenType: 'Bearer',
        user: payloadToken,
        needPassword: !((getUser?.password ?? '').length > 0),
      },
    }

    return newData
  }
}

export default AuthService
