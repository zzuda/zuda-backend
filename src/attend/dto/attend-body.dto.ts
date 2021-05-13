import { IsNumberString, IsString } from 'class-validator';

export class AttendBodyDTO {
  @IsNumberString()
  roomID!: number;

  @IsNumberString()
  randomCount!: number;

  @IsString()
  type!: string
}
