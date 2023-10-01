import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript'
import BaseEntity from './Base'
import User from './User'
import Permission from './Permission'

interface PermissionEntity {
  id?: string
  UserId: string
  PermissionId: string
  createdAt: Date
  updatedAt: Date
}

export type PermissionAttributes = Omit<
  PermissionEntity,
  'id' | 'createdAt' | 'updatedAt'
>

@Table({ tableName: 'UserPermissions' })
class UserPermission extends BaseEntity {
  @ForeignKey(() => User)
  @Column
  UserId: string

  @BelongsTo(() => User)
  User: User

  @ForeignKey(() => Permission)
  @Column
  PermissionId: string

  @BelongsTo(() => Permission)
  Permission: Permission
}

export default UserPermission
