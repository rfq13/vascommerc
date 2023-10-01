import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import Permission from '@database/entities/Permission'
import User from '@database/entities/User'
import { DtoFindAll } from '@vscommerce/interfaces/Paginate'
import ResponseError from '@vscommerce/modules/Response/ResponseError'
import PluginSqlizeQuery from '@vscommerce/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import PermissionSchema from './schema'
import UserPermission from '@database/entities/UserPermission'
import { v4 as uuidV4 } from 'uuid'

interface DtoPaginate extends DtoFindAll {
  data: Permission[]
}

// const including = [{ model: Role }, { model: Session }]

class Permissions {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const options = req.getQuery()
    const { attributes, filtered, lang } = options

    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Permission,
      PluginSqlizeQuery.makeIncludeQueryable(
        filtered,
        [] // including
      )
    )

    // const data = await Permission.findAll({
    //   ...queryFind,
    //   order: order.length ? order : [['createdAt', 'desc']],
    //   attributes: attributes
    //     ? ['id', ...JSON.parse(attributes || '[]')]
    //     : undefined,
    // })

    // get all records, not only 10

    const total = await Permission.count({
      include: includeCount,
      where: queryFind.where,
    })
    const params = {
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
      attributes: attributes
        ? ['id', ...JSON.parse(attributes || '[]')]
        : undefined,
    }

    params.limit = Number(req.query.limit) || total

    const data = await Permission.findAll(params)

    const message = i18nConfig.t('success.data_received', i18nOpt)
    return { message: `${data?.length || 0} ${message}`, data, total }
  }

  /**
   * Update Permission
   * @param req
   * @returns
   * @throws
   */
  public static async update(req: Request): Promise<any> {
    const { id } = req.getParams()
    const { body } = req

    const values = PermissionSchema.create.validateSync(body, {
      abortEarly: false,
    })

    const user = await User.findByPk(id, {
      attributes: ['id'],
    })

    if (!user) {
      throw new ResponseError.NotFound(
        i18nConfig.t('errors.data_not_found', {
          data: i18nConfig.t('user.user'),
        })
      )
    }

    await User.sequelize?.query(
      `DELETE FROM UserPermissions WHERE UserId = '${id}'`,
      {
        type: 'DELETE',
      }
    )

    const create = await UserPermission.bulkCreate(
      values.permissions.map((permission: any) => ({
        UserId: id,
        PermissionId: permission,
      }))
    )

    return create
  }

  public static async createPermissions(req: Request): Promise<any> {
    const { body } = req

    const values = PermissionSchema.bulkCreate.validateSync(body, {
      abortEarly: false,
    }) as any

    const data = [] as any

    values.forEach((value: any) => {
      const { name, path, method } = value
      data.push({
        id: uuidV4(),
        name,
        path,
        method,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    const create = await Permission.bulkCreate(data)

    return create
  }
}

export default Permissions
