import { Column, Table } from 'sequelize-typescript'
import BaseEntity from './Base'

interface PermissionEntity {
  id?: string
  name: string
  path: string
  method: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export type PermissionAttributes = Omit<
  PermissionEntity,
  'id' | 'createdAt' | 'updatedAt'
>

@Table({ tableName: 'Permissions' })
class Permission extends BaseEntity {
  @Column
  name: string

  @Column
  path: String

  @Column
  method: string
}

export default Permission
