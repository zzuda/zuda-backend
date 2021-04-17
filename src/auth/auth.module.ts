import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY', 'Default')
      }),
      inject: [ConfigService]
    })
  ],

  providers: [AuthService],
  exports: [JwtModule],
  controllers: [AuthController]
})
export class AuthModule {}
