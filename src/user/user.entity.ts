import { Room } from 'src/room/room.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryColumn('uuid')
  uuid!: string;

  @Column('char', { length: 60, unique: true })
  email!: string;

  @Column('varchar', { nullable: true })
  vendor?: string;

  @Column('varchar', { nullable: true })
  password?: string;

  @Column('varchar')
  name!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @DeleteDateColumn()
  readonly deletedAt?: Date;

  @OneToMany(() => Room, (room) => room.owner)
  rooms!: Room[];
}
