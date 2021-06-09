import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Attend } from '../attend/attend.entity';

@Entity('Room')
export class Room {
  @PrimaryGeneratedColumn()
  roomId!: number;

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

  @OneToOne(() => Attend, (attend) => attend.roomId)
  attend!: Attend;
}
