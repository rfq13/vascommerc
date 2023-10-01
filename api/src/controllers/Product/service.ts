import { APP_LANG } from '@config/env'
import { i18nConfig } from '@config/i18nextConfig'
import Product, { ProductAttributes } from '@database/entities/Product'
import { validateBoolean, validateUUID } from '@vscommerce/helpers/Formatter'
import { DtoFindAll } from '@vscommerce/interfaces/Paginate'
import { ReqOptions } from '@vscommerce/interfaces/ReqOptions'
import ResponseError from '@vscommerce/modules/Response/ResponseError'
import PluginSqlizeQuery from '@vscommerce/modules/SqlizeQuery/PluginSqlizeQuery'
import { Request } from 'express'
import { TOptions } from 'i18next'
import _ from 'lodash'
import { Op } from 'sequelize'
import ProductSchema from './schema'
import path from 'path'
import fs from 'fs'

interface DtoPaginate extends DtoFindAll {
  data: Product[]
}

class ProductService {
  /**
   *
   * @param req
   * @returns
   */
  public static async findAll(req: Request): Promise<DtoPaginate> {
    const { lang } = req.getQuery()

    const defaultLang = lang ?? APP_LANG
    const i18nOpt: string | TOptions = { lng: defaultLang }

    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      Product,
      []
    )

    const data = await Product.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Product.count({
      include: includeCount,
      where: queryFind.where,
    })

    const message = i18nConfig.t('success.data_received', i18nOpt)
    return { message: `${total} ${message}`, data, total }
  }

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  public static async findById(
    id: string,
    options?: ReqOptions
  ): Promise<Product> {
    const i18nOpt: string | TOptions = { lng: options?.lang }

    const newId = validateUUID(id, { ...options })
    const data = await Product.findOne({
      where: { id: newId },
      paranoid: options?.isParanoid,
    })

    if (!data) {
      const message = i18nConfig.t('errors.not_found', i18nOpt)
      throw new ResponseError.NotFound(`Product ${message}`)
    }

    return data
  }

  /**
   *
   * @param formData
   * @returns
   */
  public static async create(formData: ProductAttributes): Promise<Product> {
    const value = ProductSchema.create.validateSync(formData, {
      abortEarly: false,
      stripUnknown: true,
    })

    const data = await Product.create(value)

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
    formData: Partial<ProductAttributes>,
    options?: ReqOptions
  ): Promise<Product> {
    const data = await this.findById(id, { ...options })

    const value = ProductSchema.update.validateSync(
      { ...data, ...formData },
      { abortEarly: false, stripUnknown: true }
    )

    if (value.image !== data.image) {
      // delete old image
      // check if image exist
      if (
        data.image &&
        fs.existsSync(path.join(__dirname, `../../../public/${data.image}`))
      ) {
        await fs.unlinkSync(
          path.join(__dirname, `../../../public/${data.image}`)
        )
      }
    }

    const newData = await data.update({ ...data, ...value })

    return newData
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
    // force delete
    await this.delete(id, { isForce: true, ...options })
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

    await Product.restore({
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

    await Product.destroy({
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

export default ProductService
