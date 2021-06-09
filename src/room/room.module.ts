import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { WordModule } from 'src/word/word.module';
import { RoomController } from './room.controller';
import { Room } from './room.entity';
import { RoomGateway } from './room.gateway';
import { RoomMember, RoomMemberSchema } from './room.schema';
import { RoomControllService } from './services/room-controll.service';
import { RoomMemberService } from './services/room-member.service';
import { RoomService } from './services/room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    MongooseModule.forFeature([{ name: RoomMember.name, schema: RoomMemberSchema }]),
    WordModule,
    UserModule
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomMemberService, RoomControllService, RoomGateway],
  exports: [RoomService]
})
export class RoomModule {}
