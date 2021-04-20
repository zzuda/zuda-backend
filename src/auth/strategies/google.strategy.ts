import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { UserError } from 'src/shared/errors/user.error';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GOOGLE_SECRET', ''),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK', ''),
      scope: ['email', 'profile']
    });
  }

  async validate(_: string, __: string, profile: any): Promise<User> {
    // eslint-disable-next-line no-underscore-dangle
    const { email, name } = profile._json;

    const exists = await this.userService.existsUserByEmail(email);

    if (exists) {
      const user = await this.userService.findOneByEmail(email);
      if (user.vendor !== 'google') {
        throw new ConflictException(UserError.USER_ALREADY_EXISTS);
      }
      return user;
    }

    const dto = new CreateUserDTO();
    dto.email = email;
    dto.name = name;
    dto.vendor = 'google';

    const createdUser = await this.userService.create(dto);

    return createdUser;
  }
}
