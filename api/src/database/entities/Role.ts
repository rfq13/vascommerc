import { Column, Table } from 'sequelize-typescript'
import BaseEntity from './Base'

interface RoleEntity {
  id?: string
  name: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type RoleAttributes = Omit<
  RoleEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'Roles', paranoid: true })
class Role extends BaseEntity {
  @Column
  name: string
}

export default Role
