import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { UserError } from 'src/shared/errors/user.error';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID', ''),
      clientSecret: configService.get<string>('NAVER_SECRET', ''),
      callbackURL: configService.get<string>('NAVER_CALLBACK', '')
    });
  }

  async validate(_: string, __: string, profile: Profile): Promise<User> {
    // eslint-disable-next-line no-underscore-dangle
    const { email, nickname } = profile._json;

    const exists = await this.userService.existsUserByEmail(email);

    if (exists) {
      const user = await this.userService.findOneByEmail(email);
      if (user.vendor !== 'naver') {
        throw new ConflictException(UserError.USER_ALREADY_EXISTS);
      }
      return user;
    }

    const dto = new CreateUserDTO();
    dto.email = email;
    dto.name = nickname;
    dto.vendor = 'naver';

    const createdUser = await this.userService.create(dto);

    return createdUser;
  }
}
