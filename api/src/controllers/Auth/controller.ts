import { APP_LANG, APP_URL, CLIENT_URL } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import SessionService from '@controllers/Session/service'
import User, { UserLoginAttributes } from '@database/entities/User'
import asyncHandler from '@vscommerce/helpers/asyncHandler'
import {
  currentToken,
  currentUser,
  verifyAccessToken,
} from '@vscommerce/helpers/Token'
import userAgentHelper from '@vscommerce/helpers/userAgent'
import HttpResponse from '@vscommerce/modules/Response/HttpResponse'
import ResponseError from '@vscommerce/modules/Response/ResponseError'
import Authorization from '@middlewares/Authorization'
import { Request, Response, Router } from 'express'
import { TOptions } from 'i18next'
import AuthService from './service'
import Session from '@database/entities/Session'
import UserService from '@controllers/User/service'
import passport from 'passport'

const authRouter = Router()
authRouter.post(
  '/sign-up',
  asyncHandler(async function signUp(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const formData = req.getBody()

    const data = await AuthService.signUp(formData)
    const message = i18nConfig.t('success.register', i18nOpt)

    const httpResponse = HttpResponse.get({ data, message })
    res.status(200).json(httpResponse)
  })
)

authRouter.post(
  '/sign-in',
  asyncHandler(async (req: Request, res: Response) => {
    const { lang, exp = undefined } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()

    const data = await AuthService.signIn(
      formData,
      { lang: defaultLang, req },
      exp
    )
    const httpResponse = HttpResponse.get(data)

    res
      .status(200)
      .cookie('token', data.data.accessToken, {
        maxAge: Number(data.data.expiresIn) * 1000,
        httpOnly: true,
        path: '/vscommerce',
        secure: process.env.NODE_ENV === 'production',
      })
      .json(httpResponse)
  })
)

// resend verification email
authRouter.post(
  '/resend-verification',
  asyncHandler(async function resendVerification(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const formData = req.getBody()

    const data = await AuthService.sendOtpVerification(formData, true)
    const message = i18nConfig.t('success.resendVerification', i18nOpt)

    const httpResponse = HttpResponse.get({ data, message })
    res.status(200).json(httpResponse)
  })
)

authRouter.post(
  '/verify-otp-sign-in',
  asyncHandler(async function verifyOtpSignIn(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const formData = req.getBody()
    formData.token = currentToken(req)

    const data = await AuthService.verifyOtpSignIn(formData)
    const message = i18nConfig.t('success.verifyOtp', i18nOpt)

    const httpResponse = HttpResponse.get({ data, message })
    res.status(200).json(httpResponse)
  })
)

// this endpoint only for user who has not set password yet
authRouter.post(
  '/set-password',
  asyncHandler(async function setPin(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const token = currentToken(req)

    if (!verifyAccessToken(token)?.data) {
      throw new ResponseError.Unauthorized('Unauthorized')
    }

    const user = await currentUser(req, true)
    const formData = req.getBody()

    const message = await AuthService.setPassword(user, formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ message })
    res.status(200).json(httpResponse)
  })
)

// email verify
authRouter.get(
  '/email/verify',
  asyncHandler(async function verifyEmail(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const token = req.getQuery().token as string

    if (!token) {
      const httpResponse = HttpResponse.get({
        message: i18nConfig.t('errors.token_or_fcm_is_required', i18nOpt),
      })
      res.status(401).json(httpResponse)
    } else {
      const data = await AuthService.emailVerification(token, {
        lang: defaultLang,
      })

      void SessionService.deleteByUserId(data.data.user.uid)

      // create session
      await SessionService.save({
        UserId: data.data.user.uid as unknown as string,
        token: data.data.accessToken,
        ipAddress: req.clientIp?.replace('::ffff:', ''),
        device: userAgentHelper.currentDevice(req),
        platform: userAgentHelper.currentPlatform(req),
      })

      const httpResponse = HttpResponse.get(data)
      res
        .status(200)
        .cookie('token', data.data.accessToken, {
          maxAge: Number(data.data.expiresIn) * 1000,
          httpOnly: true,
          path: '/vscommerce',
          secure: process.env.NODE_ENV === 'production',
        })
        .json(httpResponse)
    }
  })
)

authRouter.post(
  '/resend-otp-sign-in',
  asyncHandler(async function resendOtpSignIn(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    try {
      // get bearer token
      const getToken = currentToken(req)
      const token = verifyAccessToken(getToken)

      // get uid from token
      const tokenData = token?.data as any

      if (!tokenData?.uid) {
        const message = i18nConfig.t('errors.auth_needed', i18nOpt)
        throw new ResponseError.BadRequest(message)
      }

      // find otp on Sessions by UserId
      const session = await Session.findOne({
        where: {
          UserId: tokenData.uid,
          token: getToken.replace('Bearer ', ''),
        },
        include: [
          {
            model: User,
            attributes: ['email', 'fullName', 'phone'],
          },
        ],
      })

      if (session?.User && session?.otp) {
        const data = await AuthService.sendOtpVerification({
          email: session.User.email,
          phone: session.User.phone,
          fullName: session.User.fullName,
          randCode: session.otp,
        })
        const httpResponse = HttpResponse.get(data)
        res.status(200).json(httpResponse)
      } else {
        const message = i18nConfig.t('errors.session_not_found', i18nOpt)
        throw new ResponseError.BadRequest(message)
      }
    } catch (error: any) {
      const httpResponse = HttpResponse.get({
        message: error?.message,
        // error,
        code: error?.statusCode,
      })
      res.status(error?.statusCode || 401).json(httpResponse)
    }
  })
)

authRouter.post(
  '/forgot-password',
  asyncHandler(async function forgotPassword(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const token = currentToken(req)

    if (!verifyAccessToken(token)?.data) {
      throw new ResponseError.Unauthorized('Unauthorized')
    }

    const formData = req.getBody()
    const message = await AuthService.forgotPassword(formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ message })
    res.status(200).json(httpResponse)
  })
)

authRouter.post(
  '/verify-forgot-password',
  asyncHandler(async function verifyForgotPassword(
    req: Request,
    res: Response
  ) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()
    const data = await AuthService.verifyTokenForgotPassword(formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ message: data })
    res.status(200).json(httpResponse)
  })
)

authRouter.post(
  '/reset-password',
  asyncHandler(async function resetPassword(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const token = currentToken(req)

    if (!verifyAccessToken(token)?.data) {
      throw new ResponseError.Unauthorized('Unauthorized')
    }

    const formData = req.getBody()
    const data = await AuthService.resetPassword(formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

authRouter.post(
  '/refresh-token',
  asyncHandler(async function refreshToken(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()

    const data = await AuthService.refreshToken(formData, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

authRouter.post(
  '/logout',
  Authorization,
  asyncHandler(async function logout(req: Request, res: Response) {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const formData = req.getBody()
    const getToken = currentToken(req)
    const userLogin = req.getState('userLogin') as UserLoginAttributes

    if (userLogin.uid !== formData.UserId) {
      const message = i18nConfig.t('errors.invalid_user_login', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }

    const message = await AuthService.logout(userLogin.uid, getToken, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get({ message })
    res.status(200).clearCookie('token', { path: '/v1' }).json(httpResponse)
  })
)

authRouter.get(
  '/generate-hash',
  asyncHandler(async function generateHash(req: Request, res: Response) {
    const { str } = req.getQuery()

    const data = await AuthService.generateHash(str)

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

authRouter.get(
  '/my-profile',
  Authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const { lang, attributes } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const user = req.state as any
    const id = user?.userLogin?.uid
    const roleId = user.userLogin.role

    if (!id) {
      res.status(400).json({
        code: 400,
        message: 'User not found',
      })

      return
    }

    const data = await UserService.findById(
      id,
      {
        lang: defaultLang,
        attributes,
      },
      roleId
    )

    delete data?.password

    const httpResponse = HttpResponse.get({ data })
    res.status(200).json(httpResponse)
  })
)

authRouter.delete(
  '/delete-account',
  Authorization,
  asyncHandler(async (req: Request, res: Response) => {
    const { lang } = req.getQuery()
    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const message = i18nConfig.t('errors.user_not_found', i18nOpt)

    const user = await currentUser(req, false, message)
    const formData = req.getBody()

    // get token
    const getToken = currentToken(req)

    const data = await AuthService.deleteUser(user, formData, getToken, {
      lang: defaultLang,
    })

    const httpResponse = HttpResponse.get(data)
    res.status(200).json(httpResponse)
  })
)

authRouter.get(
  '/email/verify',
  asyncHandler(async function verifyEmail(req: Request, res: Response) {
    let message = 'Email verified'

    if (req.query?.token) {
      const updatedData = await User.update(
        { isActive: true, tokenVerify: null },
        {
          where: {
            tokenVerify: req.query.token,
          },
        }
      )

      // count updated data
      if (updatedData[0] === 0) {
        message = 'Token expired'
      }
    } else {
      message = 'Token not found'
    }

    const httpResponse = HttpResponse.get({
      message,
    })

    res.status(200).json(httpResponse)
  })
)

authRouter.post(
  '/admin/sign-in',
  asyncHandler(async (req: Request, res: Response) => {
    const { lang, exp = undefined } = req.getQuery()
    const defaultLang = lang ?? APP_LANG

    const formData = req.getBody()

    const data = await AuthService.signInAdmin(
      formData,
      { lang: defaultLang, req },
      exp
    )
    const httpResponse = HttpResponse.get(data)

    res
      .status(200)
      .cookie('token', data.data.accessToken, {
        maxAge: Number(data.data.expiresIn) * 1000,
        httpOnly: true,
        path: '/vscommerce',
        secure: process.env.NODE_ENV === 'production',
      })
      .json(httpResponse)
  })
)

authRouter.get(
  '/google/login/failed',
  asyncHandler(async (req: Request, res: Response) => {
    const httpResponse = HttpResponse.get({
      message: 'Google login failed',
    })

    res.status(401).json(httpResponse)
  })
)

authRouter.get(
  '/google/login',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

authRouter.get(
  '/session/google',
  passport.authenticate('google', {
    failureRedirect: `${APP_URL}/auth/google/login/failed`,
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const user = req?.user as any

    const data = await AuthService.socialLogin(user)

    // create session
    await SessionService.createOrUpdate({
      UserId: data.data.user.uid as unknown as string,
      token: data.data.accessToken,
      ipAddress: req?.ip || req.clientIp?.replace('::ffff:', ''),
      device: userAgentHelper.currentDevice(req),
      platform: userAgentHelper.currentPlatform(req),
    })

    res
      .status(200)
      .cookie('token', data.data.accessToken, {
        maxAge: Number(data.data.expiresIn) * 1000,
        httpOnly: true,
        path: '/vscommerce',
        secure: process.env.NODE_ENV === 'production',
      })
      .redirect(`${CLIENT_URL}?token=${data.data.accessToken}`)
  })
)

export default authRouter
