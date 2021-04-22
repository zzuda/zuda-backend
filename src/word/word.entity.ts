import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Word')
export class Word {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { unique: true })
  word!: string;
}
