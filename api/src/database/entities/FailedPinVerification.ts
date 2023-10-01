import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript'
import BaseEntity from './Base'
import User from './User'

interface FailedPinVerificationEntity {
  id?: string
  userId: string
  pin: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type FailedPinVerificationAttributes = Omit<
  FailedPinVerificationEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'FailedPinVerifications', paranoid: true })
class FailedPinVerification extends BaseEntity {
  @ForeignKey(() => User)
  @Column
  userId: string

  @BelongsTo(() => User)
  User: User

  @Column
  pin: string
}

export default FailedPinVerification
