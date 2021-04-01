import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript';

interface IUser {
  uuid: string;
  email: string;
  vendor?: string;
  password?: string;
  name: string;
}

@Table({
  timestamps: true,
  paranoid: true
})
export class User extends Model<IUser> {
  @PrimaryKey
  @Unique
  @Column({ type: DataType.UUID })
  uuid!: string;

  @Unique
  @Column({ type: DataType.CHAR })
  email!: string;

  @AllowNull
  @Column({ type: DataType.STRING })
  vendor?: string;

  @AllowNull
  @Column({ type: DataType.STRING })
  password?: string;

  @Column({ type: DataType.STRING })
  name!: string;

  @CreatedAt
  @Column
  readonly createdAt!: Date;

  @UpdatedAt
  @Column
  readonly updatedAt!: Date;

  @DeletedAt
  @Column
  readonly deletedAt?: Date;
}
