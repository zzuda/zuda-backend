import { Controller, Get, Post, Body } from '@nestjs/common';

import { AttendService } from './attend.service'
import { AttendBodyDTO } from './dto/attend-body.dto'


@Controller('attend')
export class AttendController {
    constructor( private readonly attendService: AttendService ) {}

  @Post('create')

  createAttendWord(@Body() attendBodyDTO: AttendBodyDTO): string{
    const result = this.attendService.createWord(attendBodyDTO)

    return result;
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}