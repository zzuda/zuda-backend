import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Room } from './room/room.entity';
import { RoomModule } from './room/room.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 3306),
        username: config.get<string>('DATABASE_USERNAME', 'root'),
        password: config.get<string>('DATABASE_PASSWORD', 'test'),
        database: config.get<string>('DATABASE_DB', 'zuda'),
        entities: [User, Room]
      })
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1000
    }),
    UserModule,
    AuthModule,
    RoomModule
  ]
})
export class AppModule {}
