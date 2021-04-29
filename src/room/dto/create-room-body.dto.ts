import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateRoomBodyDTO {
  @IsString()
  @ApiProperty({ type: String, description: '방 이름' })
  roomName!: string;

  @IsUUID()
  @ApiProperty({ type: String, description: '방 생성자' })
  owner!: string;

  @IsString()
  @ApiProperty({ type: Number, description: '입장 가능한 최대 인원' })
  maxPeople!: number;
}
