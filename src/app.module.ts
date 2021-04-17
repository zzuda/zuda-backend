import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 3305),
        username: config.get<string>('DATABASE_USERNAME', 'root'),
        password: config.get<string>('DATABASE_PASSWORD', 'test'),
        database: config.get<string>('DATABASE_DB', 'zuda'),

        autoLoadModels: true,
        logging: false
      })
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1000
    }),
    UserModule,
    AuthModule
  ]
})
export class AppModule {}
