import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { UserService } from 'src/user/user.service';
import { CreateRoomBodyDTO } from './dto/create-room-body.dto';
import { CreateRoomDTO } from './dto/create-room.dto';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { Room } from './room.entity';
import { RoomMemberService } from './services/room-member.service';
import { RoomService } from './services/room.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomMemberService: RoomMemberService,
    private readonly userService: UserService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createRoomBodyDto: CreateRoomBodyDTO): Promise<Room> {
    const uuid = createRoomBodyDto.owner;
    const user = await this.userService.findOneByUUID(uuid);

    const createRoomDto = new CreateRoomDTO();
    createRoomDto.roomName = createRoomBodyDto.roomName;
    createRoomDto.owner = user;
    createRoomDto.maxPeople = createRoomBodyDto.maxPeople;

    const room = await this.roomService.create(createRoomDto);
    return room;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Room[]> {
    const result = await this.roomService.findAll();
    return result;
  }

  @Get('/:roomId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('roomId') roomId: number): Promise<Room> {
    const result = await this.roomService.getRoom(roomId);
    return result;
  }

  @Put('/:roomId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('roomId') roomId: number,
    @Body() updateRoomDto: UpdateRoomDTO
  ): Promise<Room> {
    const result = await this.roomService.update(roomId, updateRoomDto);
    return result;
  }

  @Delete('/:roomId')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('roomId') roomId: number): Promise<Room> {
    const room = await this.roomService.delete(roomId);
    await this.roomMemberService.deleteRoomMember(roomId);
    return room;
  }
}
