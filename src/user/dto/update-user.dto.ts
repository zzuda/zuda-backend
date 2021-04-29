import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '유저 비밀번호', required: false })
  password?: string;

  @IsString()
  @ApiProperty({ type: String, description: '유저 이름' })
  name!: string;
}
