import {
  Column,
  CreatedAt,
  DataType,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript'

@Table({ tableName: 'base' })
class BaseEntity extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string

  @DeletedAt
  @Column
  deletedAt!: Date

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date

  upsert(values: any, condition: any) {
    return BaseEntity.findOne({ where: condition }).then(function (obj) {
      // update
      if (obj) return obj.update(values)
      // insert
      return BaseEntity.create(values)
    })
  }
}

export default BaseEntity
