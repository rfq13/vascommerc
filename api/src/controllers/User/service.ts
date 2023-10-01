import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
// import Role from '@database/entities/Role'
import User, { UserAttributes } from '@database/entities/User'
import {
  validateBoolean,
  validateEmpty,
  validateUUID,
} from '@vscommerce/helpers/Formatter'
import { DtoFindAll } from '@vscommerce/interfaces/Paginate'
import ConstRole from '@vscommerce/constants/ConstRole'
import { ReqOptions } from '@vscommerce/interfaces/ReqOptions'
import ResponseError from '@vscommerce/modules/Response/ResponseError'
import PluginSqlizeQuery from '@vscommerce/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import _, { values } from 'lodash'
import { Op } from 'sequelize'
import userSchema from './schema'
import Role from '@database/entities/Role'
import UserPermission from '@database/entities/UserPermission'
import Permission from '@database/entities/Permission'
import Session from '@database/entities/Session'
import bcrypt from 'bcrypt'
import FailedPinVerification from '@database/entities/FailedPinVerification'
import db from '@database/data-source'

interface DtoPaginate extends DtoFindAll {
  data: User[]
}

const including = [{ model: Role }]

class UserService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const { lang, filtered, attributes } = req.getQuery()

    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      User,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const params = {
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
      attributes: attributes
        ? ['id', ...JSON.parse(attributes ?? '[]')]
        : undefined,
    }

    if (
      filtered &&
      JSON.parse(filtered).find(
        (item: any) =>
          item.id === 'Role.name' && item.value.toLowerCase().includes('admin')
      )
    ) {
      params.where = {
        ...params.where,
        RoleId: {
          [Op.not]: ConstRole.ID_USER,
        },
      }

      params.include = [
        {
          model: UserPermission,
          attributes: ['id', 'UserId', 'PermissionId'],
          paranoid: false,
          include: [
            {
              model: Permission,
              attributes: ['id', 'name'],
              paranoid: false,
            },
          ],
        },
      ]
    }

    const data = await User.findAll(params)
    const total = await User.count({
      include: includeCount,
      where: queryFind.where,
    })

    const message = i18nConfig.t('success.data_received', i18nOpt)
    return { message: `${data?.length ?? 0} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: ReqOptions,
    roleId?: string,
    withPassword?: boolean
  ): Promise<User> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    let include

    if (roleId && [...values(ConstRole.ROLE_ADMIN)].includes(roleId)) {
      include = [
        {
          model: UserPermission,
          attributes: ['id'],
          paranoid: false,
          include: [
            {
              model: Permission,
              attributes: ['id', 'path', 'method'],
              paranoid: false,
            },
          ],
        },
      ]
    }

    let scope
    if (withPassword) {
      scope = 'withPassword'
    }

    const data = await User.scope(scope).findOne({
      where: { id: newId },
      include, // including,
      paranoid: options?.isParanoid,
      attributes: options?.attributes
        ? ['id', ...JSON.parse(options?.attributes ?? '[]')]
        : undefined,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`user ${message}`)
    }

    return data
  }

  /**
   *
   * @param email
   * @param options
   */
  public static async validateEmail(
    email: string,
    options?: ReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const data = await User.findOne({
      where: { email },
    })

    if (data) {
      const message = i18nConfig.t('errors.already_email', i18nOpt)
      throw new ResponseError.BadRequest(message)
    }
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: UserAttributes): Promise<User> {
    const value = userSchema.create.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const newFormData = {
      ...value,
      phone: validateEmpty(value?.phone),
      password: validateEmpty(value?.password),
      RoleId: ConstRole.ID_USER,
    }

    const data = await User.create(newFormData)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   * @param options
   * @returns
   */
  public static async update(
    id: string,
    formData: Partial<UserAttributes>,
    options?: ReqOptions
  ): Promise<User> {
    const data = await this.findById(id, { ...options }, undefined, true)

    // validate email from request
    if (!_.isEmpty(formData.email) && formData.email !== data.email) {
      await this.validateEmail(String(formData.email), { ...options })
    }

    const value = userSchema.update.validateSync(
      { ...data, ...formData },
      { abortEarly: false, stripUnknown: true }
    )

    const newFormData = {
      ...data,
      ...value,
      phone: validateEmpty(value?.phone),
      password: validateEmpty(value?.password),
    }

    if (newFormData.password) {
      if (newFormData.password.length < 8) {
        // {"code":422,"message":"at least 8 characters","errors":{"password":"at least 8 characters"}}
        throw new ResponseError.BadRequest('password at least 8 characters')
      }

      // check if old password is same with new password
      // check using bcrypt
      if (value.old_password && data.password) {
        const isSame = bcrypt.compareSync(value.old_password, data.password)

        if (!isSame) {
          throw new ResponseError.BadRequest('old password is not same')
        }
      }
    } else {
      delete newFormData.password
    }

    if (!newFormData.phone) {
      delete newFormData.phone
    }

    await User.update(newFormData, {
      where: { id: data.id },
      individualHooks: true,
    })

    return data
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async restore(id: string, options?: ReqOptions): Promise<void> {
    const data = await this.findById(id, { isParanoid: false, ...options })
    await data.restore()
  }

  /**
   *
   * @param id
   * @param options
   */
  private static async delete(id: string, options?: ReqOptions): Promise<void> {
    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.isForce)

    if (isForce) {
      try {
        await Session.destroy({ where: { UserId: id }, force: isForce })
        await UserPermission.destroy({ where: { UserId: id }, force: isForce })
      } catch (error) {
        console.log('error on destroy User', error)
      }
    }

    const data = await this.findById(id, { ...options })
    await data.destroy({ force: isForce })
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async softDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    // soft delete
    await this.delete(id, options)
  }

  /**
   *
   * @param id
   * @param options
   */
  public static async forceDelete(
    id: string,
    options?: ReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }
    const txn = await db.sequelize.transaction()
    try {
      // delete all related data
      await FailedPinVerification.destroy({
        where: { UserId: id },
        force: true,
        transaction: txn,
      })
      await Session.destroy({
        where: { UserId: id },
        force: true,
        transaction: txn,
      })
      await UserPermission.destroy({
        where: { UserId: id },
        force: true,
        transaction: txn,
      })
      await User.destroy({
        where: { id },
        force: true,
        transaction: txn,
      })
      await txn.commit()
    } catch (error) {
      await txn.rollback()
      const message = i18nConfig.t('failed.delete_user', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    // force delete
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleRestore(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cant_be_empty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    await User.restore({
      where: { id: { [Op.in]: ids } },
    })
  }

  /**
   *
   * @param ids
   * @param options
   */
  private static async multipleDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    // if true = force delete else soft delete
    const isForce = validateBoolean(options?.isForce)

    if (_.isEmpty(ids)) {
      const message = i18nConfig.t('errors.cant_be_empty', i18nOpt)
      throw new ResponseError.BadRequest(`ids ${message}`)
    }

    await User.destroy({
      where: { id: { [Op.in]: ids } },
      force: isForce,
    })
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleSoftDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    // multiple soft delete
    await this.multipleDelete(ids, options)
  }

  /**
   *
   * @param ids
   * @param options
   */
  public static async multipleForceDelete(
    ids: string[],
    options?: ReqOptions
  ): Promise<void> {
    // multiple force delete
    await this.multipleDelete(ids, { isForce: true, ...options })
  }
}

export default UserService
