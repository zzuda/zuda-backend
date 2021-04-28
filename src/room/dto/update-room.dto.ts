import { IsString } from 'class-validator';

export class UpdateRoomDTO {
  @IsString()
  roomName!: string;
}
