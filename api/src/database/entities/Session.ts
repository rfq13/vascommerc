import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseEntity from './Base'
import User from './User'

interface SessionEntity {
  id?: string
  UserId: string
  token: string
  otp?: string | null
  ipAddress?: string | null
  device?: string | null
  platform?: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type SessionAttributes = Omit<
  SessionEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@Table({ tableName: 'Sessions' })
class Session extends BaseEntity {
  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  UserId: string

  @BelongsTo(() => User)
  User: User

  @Column({ type: DataType.TEXT })
  token: string

  @Column({ type: DataType.STRING })
  otp: string

  @Column
  ipAddress?: string

  @Column
  device?: string

  @Column
  platform?: string
}

export default Session
