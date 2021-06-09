import { Room } from 'src/room/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('Attend')
export class Attend {
  @PrimaryGeneratedColumn()
  attendId!: number;

  @Column('json')
  words!: string[];

  @OneToOne(() => Room, (room) => room.attend, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'roomId' })
  roomId!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
}
