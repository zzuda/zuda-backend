import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileBodyDTO {
  @IsNumberString()
  @ApiProperty({ type: Number, description: '방 ID' })
  roomId!: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '파일 이름', required: false })
  fileName?: string;
}
