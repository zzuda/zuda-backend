import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Room } from './room/room.entity';
import { RoomModule } from './room/room.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Word } from './word/word.entity';
import { WordModule } from './word/word.module';
import { FileModule } from './file/file.module';

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
        entities: [User, Room, Word]
      })
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get('MONGO_HOST', 'localhost');
        const port = config.get('MONGO_PORT', 27017);
        const username = config.get('MONGO_USERNAME', '');
        const password = config.get('MONGO_PASSWORD', '');

        return {
          uri: `mongodb://${username}:${password}@${host}:${port}`
        };
      }
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1000
    }),
    UserModule,
    AuthModule,
    RoomModule,
    WordModule,
    FileModule,
  ]
})
export class AppModule {}
