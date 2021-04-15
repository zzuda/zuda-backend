import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import  {ConfigModule, ConfigService } from '@nestjs/config' //ConfigModule 은 import 되지 않음, (이미 main.ts에서 global로 넣어줘서 ㅎㅎ)
import {AuthController} from 'src/auth/auth.controller';
import { AuthService } from './auth.service';
//import { Injectable } from '@nestjs/common';

//@Injectable()
//export class AuthService {
//  constructor(private readonly jwtService: JwtService) {}
//}

@Module({
    imports:[ //살짝 이거 글로벌한 설정인듯 기본적으로 사용되는 설정인 느낌...? /  service에서 사용할때...? 
        JwtModule.registerAsync({ //토큰 발급
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET_KEY', 'Default'), //get이 NULL 되면 안되서 두번쨰 인자로 기본값을 아무거나 넣어주었다
              //signOptions:{ expiresIn: `${configService.get('JWT_SECRET_EXPIRE_TIME')}s` }, // <- 이거는 service에서 따로 설정할거니까 필요없다고 했다. 
              //블로그 포스팅에서 뭔가 참고해봐야 하나 (https://velog.io/@algo2000/pj01-12)
              
              //signOptions: { expiresIn: '60s' },
            }),
            inject: [ConfigService],
          }),
    ],
   
    providers: [AuthService],
    exports: [ JwtModule ],
    controllers: [AuthController],
  })
  export class AuthModule {}