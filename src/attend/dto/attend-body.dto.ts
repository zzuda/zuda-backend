import { IsNumber, IsString } from 'class-validator';

export class AttendBodyDTO {
  @IsNumber()
  roomId!: number;

  @IsNumber()
  randomCount!: number;

  @IsString()
  type!: string
}
