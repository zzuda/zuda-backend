import { IsObject, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';

export class CreateRoomDTO {
  @IsString()
  roomName!: string;

  @IsObject()
  owner!: User;

  @IsString()
  maxPeople!: number;
}
