import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './room.controller';
import { Room } from './room.entity';
import { RoomGateway } from './room.gateway';
import { RoomMember, RoomMemberSchema } from './room.schema';
import { RoomService } from './room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    MongooseModule.forFeature([{ name: RoomMember.name, schema: RoomMemberSchema }])
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway]
})
export class RoomModule {}
