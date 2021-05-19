import { Controller, Get, Post, Body } from '@nestjs/common';

import { AttendService } from './attend.service'
import { AttendBodyDTO } from './dto/attend-body.dto'
import { CreatedWordReturn } from '../types/index'

@Controller('attend')
export class AttendController {
    constructor( private readonly attendService: AttendService ) {}

  @Post('create')
  createAttendWord(@Body() attendBodyDTO: AttendBodyDTO): CreatedWordReturn{
    const result = this.attendService.createWord(attendBodyDTO)

    return result;
  }

  @Get()
  findAll(): string {
    return 'This is test action lmao';
  }
}