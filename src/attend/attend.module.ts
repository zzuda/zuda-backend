import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendController } from './attend.controller';
import { AttendService } from './attend.service';
import { WordModule } from '../word/word.module';
import { Attend } from './attend.entity';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attend]), RoomModule, WordModule],
  controllers: [AttendController],
  providers: [AttendService]
})
export class AttendModule {}
