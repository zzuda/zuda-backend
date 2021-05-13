import { Module } from '@nestjs/common';
import { AttendController } from './attend.controller';
import { AttendService } from './attend.service';

@Module({
  controllers: [AttendController],
  providers: [AttendService],
})
export class attendModule {}