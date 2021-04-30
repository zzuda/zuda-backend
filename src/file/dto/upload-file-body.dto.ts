import { IsNumberString } from 'class-validator'

export class FileBodyDTO{
    
    @IsNumberString()
    roomID!: number;
}