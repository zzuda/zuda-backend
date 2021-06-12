import { IsJSON, IsNumber,IsString } from 'class-validator';


export class CreateAttendDTO {
  @IsNumber()
  attendId!: number;

  @IsNumber()
  roomId!: number;

  @IsJSON()
  words!: string[];

  @IsString()
  maxPeople!: number;
}
