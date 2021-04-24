import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateRoomBodyDTO } from './dto/create-room-body.dto';
import { CreateRoomDTO } from './dto/create-room.dto';
import { Room } from './room.entity';
import { RoomService } from './services/room.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService
  ) {}

  @Post()
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
}
