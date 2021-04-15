import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import  {ConfigModule, ConfigService } from '@nestjs/config' //ConfigModule 은 import 되지 않음, (이미 main.ts에서 global로 넣어줘서 ㅎㅎ)
//import { Injectable } from '@nestjs/common';

//@Injectable()
//export class AuthService {
//  constructor(private readonly jwtService: JwtService) {}
//}


@Module({
    imports:[
        JwtModule.registerAsync({ //토큰 발급
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET_KEY'),
              signOptions:{ expiresIn: configService.get<string>('JWT_SECRET_EXPIRE_TIME') },
              
              //signOptions: { expiresIn: '60s' },
            }),
            inject: [],
          }),
    ],
   
    providers: [],
    exports: [ JwtModule ],
  })
  export class AuthModule {}