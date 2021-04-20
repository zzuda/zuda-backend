import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('Room')
export class Room {
  @PrimaryGeneratedColumn()
  roomID!: string;

  @Column('varchar', { unique: true })
  roomName!: string;

  @Column('varchar')
  inviteCode!: string;

  @Column('integer')
  maxPeople!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.rooms, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'owner' })
  owner!: User;
}
