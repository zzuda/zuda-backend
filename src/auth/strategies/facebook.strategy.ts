import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { UserError } from 'src/shared/errors/user.error';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Vendor } from '../../types';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, Vendor.FACEBOOK) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID', ''),
      clientSecret: configService.get<string>('FACEBOOK_SECRET', ''),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK', ''),
      scope: ['email', 'public_profile'],
      profileFields: ['displayName', 'email']
    });
  }

  async validate(_: string, __: string, profile: Profile): Promise<User> {
    // eslint-disable-next-line no-underscore-dangle
    const { email, name } = profile._json;

    const exists = await this.userService.existsUserByEmail(email);

    if (exists) {
      const user = await this.userService.findOneByEmail(email);
      if (user.vendor !== Vendor.FACEBOOK) {
        throw new ConflictException(UserError.USER_ALREADY_EXISTS);
      }
      return user;
    }

    const dto = new CreateUserDTO();
    dto.email = email;
    dto.name = name;
    dto.vendor = Vendor.FACEBOOK;

    const createdUser = await this.userService.create(dto);

    return createdUser;
  }
}
