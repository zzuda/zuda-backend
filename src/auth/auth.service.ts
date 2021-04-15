import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{
    constructor(
        private jwtService: JwtService
    ) {}

    //Generate Token
    async generateToken(UUID: string){ //UUID will 
        const payload = { UUID };
        return{
            access_token: this.jwtService.sign(payload)
        };
    }
}