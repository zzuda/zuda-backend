import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import  { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService{
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    //Generate Token
    async generateToken(UUID: string){ //UUID will be implement with other Auth(login) function
        const payload = { UUID };
        console.log(this.configService.get('JWT_SECRET_EXPIRE_TIME', 'Default' ) + "BLALJFLJLDFSJ")
        const token = this.jwtService.sign(payload, {
            
            secret: this.configService.get('JWT_SECRET_KEY', 'Default'), //get이 NULL 되면 안되서 두번쨰 인자로 기본값을 아무거나 넣어주었다
            expiresIn: `${this.configService.get(
              'JWT_SECRET_EXPIRE_TIME', 'Default'
            )}s`,
          });
          
          
        return{
           TOKEN: token
        };
    };

    async validateToken(access_token: any, isValid: boolean){ //isVaild will return as boolean
       return{
        isValid: this.jwtService.verify(access_token)
       }
         
    };

    async refreshToken(UUID : string){
        const payload = { UUID };

        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_KEY', 'Default'), //get이 NULL 되면 안되서 두번쨰 인자로 기본값을 아무거나 넣어주었다
            expiresIn: `${this.configService.get(
              'JWT_REFRESH_EXPIRE_TIME',
            )}s`,
          });

        return{
           REFRESH_TOKEN: refresh_token
        };
    };

//    async generateToken(UUID: string){ //UUID will be implement with other Auth(login) function
//       const payload = { UUID };
//        return{
//            access_token: this.jwtService.sign(payload) //엑세스 토큰은 jwtService에 sign 함수를 통해 발급
//        };
//    };
//
//    async validateToken(TOKEN: string){
//        const TOKEN = {access_token}
//        isValidate: this.jwtService.verify(TOKEN)
//   };
//
//    async refreshToken(){
//
//    };


    

    
}