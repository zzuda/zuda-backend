import { IsString } from 'class-validator';

export class CreateRoomDTO {
  @IsString()
  roomName!: string;

  @IsString()
  owner!: string;

  @IsString()
  maxPeople!: number;
}
