import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateGuestNameDto {
  @IsString()
  @ApiProperty({ type: String, description: '게스트ID' })
  guestId!: string;

  @IsString()
  @ApiProperty({ type: String, description: '바꿀 이름' })
  name!: string;
}
