import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class FileBodyDTO{
    @IsNumberString()
    roomID!: number;

    @IsString()
    @IsOptional()
    fileName?: string;

}