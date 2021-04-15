
import { AuthService } from 'src/auth/auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


// 토큰 생성 테스트용 POST
  @Post()
  async generateToken(@Body() uuid : string){ //Body로 createUserDto변수는, 임포트한 CreateUserDto 규칙에 따라 userSerice에 create 함수로 createUserDto변수값을 전송 
    const result = await this.authService.generateToken(uuid);  //userSerive에 create 함수로 createUserDto변수를 전송하여 나온 결과값을 return (리턴) 
    return result;
  }
}