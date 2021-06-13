import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('Attend')
export class Attend {
  @PrimaryGeneratedColumn()
  attendId!: number;

  @Column('json')
  words!: string[];

  @Column('integer')
  roomId!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
}
