import { Column, Table } from 'sequelize-typescript'
import BaseEntity from './Base'

interface ProductEntity {
  id?: string
  name: string
  image: string
  price: number
  status: boolean
  description?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type ProductAttributes = Omit<
  ProductEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'Products', paranoid: true })
class Product extends BaseEntity {
  @Column
  name: string

  @Column
  image: string

  @Column
  price: number

  @Column
  status: boolean

  @Column
  description?: string
}

export default Product
