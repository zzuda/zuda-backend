import { IsNumber, IsString } from 'class-validator';

export class AttendBodyDTO {
  @IsNumber()
  roomID!: number;

  @IsNumber()
  randomCount!: number;

  @IsString()
  type!: string
}
