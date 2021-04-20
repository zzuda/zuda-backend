import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryColumn('uuid')
  uuid!: string;

  @Column('char', { unique: true })
  email!: string;

  @Column('string', { nullable: true })
  vendor?: string;

  @Column('string', { nullable: true })
  password?: string;

  @Column('string')
  name!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @DeleteDateColumn()
  readonly deletedAt?: Date;
}
