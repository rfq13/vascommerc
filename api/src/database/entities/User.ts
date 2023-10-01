import * as bcrypt from 'bcrypt'
import {
  Column,
  DataType,
  DefaultScope,
  Scopes,
  Table,
  ForeignKey,
  IsUUID,
  BelongsTo,
  HasMany,
  BeforeUpdate,
  BeforeCreate,
} from 'sequelize-typescript'
import BaseEntity from './Base'
import Role from './Role'
import UserPermission from './UserPermission'

interface UserEntity {
  id?: string
  email: string
  fullName: string
  password?: string | null
  pin?: string | null
  phone?: string | null
  tokenVerify?: string | null
  isActive?: boolean | null
  isTester?: boolean | null
  isDemo?: boolean | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  RoleId: string
}

export interface UserLoginAttributes {
  uid: string
  role: string
}

export type CreatePassword = Pick<UserEntity, 'password'>

export interface ForgotPasswordAttributes {
  email?: string
  phone?: string
}

export interface VerifyTokenForgotPasswordAttributes {
  email: string
  token: string
}

export interface ResetPasswordAttributes {
  email: string
  token: string
  password: string
}

export interface RefreshTokenAttributes {
  refreshToken: string
}

export type LoginAttributes = Pick<UserEntity, 'email' | 'phone' | 'password'>

export type UserAttributes = Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

@DefaultScope(() => ({
  attributes: {
    exclude: ['password', 'tokenVerify'],
  },
}))
@Scopes(() => ({
  withPassword: {},
}))
@Table({ tableName: 'Users', paranoid: true })
class User extends BaseEntity {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: 'email required' },
      notEmpty: { msg: 'email required' },
      isEmail: { msg: 'email format is invalid' },
    },
    unique: true,
  })
  email: string

  @Column({ type: DataType.STRING('20') })
  phone?: string

  @Column
  fullName?: string

  @Column
  password?: string

  @Column({ type: DataType.TEXT })
  tokenVerify?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isActive?: boolean

  @IsUUID(4)
  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  RoleId: string

  @BelongsTo(() => Role)
  Role: Role

  @HasMany(() => UserPermission)
  UserPermissions: UserPermission[]

  @BeforeUpdate
  @BeforeCreate
  static setUserPassword(instance: User): void {
    const { password } = instance
    if (password) {
      let newPass = password
      const saltRounds = 10
      // check if password is already hashed
      if (newPass.length < 60) {
        newPass = bcrypt.hashSync(newPass, saltRounds)
      }

      instance.setDataValue('password', newPass)
    }
  }

  comparePassword: (currentPassword: string) => Promise<boolean>
}

User.prototype.comparePassword = async function (
  currentPassword: string
): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    const password = String(this.password)

    void bcrypt.compare(currentPassword, password, function (err, isMatch) {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

export default User
