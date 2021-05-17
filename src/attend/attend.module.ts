import { Module } from '@nestjs/common';
import { AttendController } from './attend.controller';
import { AttendService } from './attend.service';
import { WordModule } from '../word/word.module';

@Module({
  imports: [WordModule],
  controllers: [AttendController],
  providers: [AttendService],
})
export class AttendModule {}