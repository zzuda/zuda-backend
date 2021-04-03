import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  vendor?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  name!: string;
}
