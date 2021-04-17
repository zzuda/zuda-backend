import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { AuthError } from 'src/shared/errors/auth.error';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalLoginDTO } from './dto/local-login.dto';
import { LocalRegisterDTO } from './dto/local-register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('/register')
  async localRegister(@Body() registerDTO: LocalRegisterDTO): Promise<User> {
    const registeredUser = await this.userService.create(registerDTO);

    return registeredUser;
  }

  @Post('/login')
  async localLogin(
    @Body() loginDTO: LocalLoginDTO
  ): Promise<{
    user: User;
    token: string;
    refreshToken: string;
  }> {
    const { email, password } = loginDTO;
    const validation = await this.authService.validateLocalLogin(email, password);

    if (!validation) throw new NotFoundException(AuthError.EMAIL_OR_PASSWORD_ERROR);

    const user = await this.userService.findOneByEmail(email);

    return {
      user,
      token: this.authService.generateToken(user.uuid).TOKEN,
      refreshToken: this.authService.refreshToken(user.uuid).REFRESH_TOKEN
    };
  }
}
