import { IsNumberString, IsObject } from 'class-validator'

export class FileBodyDTO{
    
    @IsNumberString()
    roomID!: number;

}