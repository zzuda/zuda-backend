import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDTO {
  @IsUUID()
  uuid!: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  name!: string;
}
