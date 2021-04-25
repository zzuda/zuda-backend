import { IsNumber, IsString } from 'class-validator';

export class UpdateRoomDTO {
  @IsNumber()
  roomId!: number;

  @IsString()
  roomName!: string;
}
