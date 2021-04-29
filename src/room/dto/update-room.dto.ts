import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateRoomDTO {
  @IsString()
  @ApiProperty({ type: String, description: '방 이름' })
  roomName!: string;
}
