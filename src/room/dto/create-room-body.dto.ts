import { IsString, IsUUID } from 'class-validator';

export class CreateRoomBodyDTO {
  @IsString()
  roomName!: string;

  @IsUUID()
  owner!: string;

  @IsString()
  maxPeople!: number;
}
