import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { RoomError } from 'src/shared/errors/room.error';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { UserService } from 'src/user/user.service';
import { CreateRoomBodyDTO } from './dto/create-room-body.dto';
import { CreateRoomDTO } from './dto/create-room.dto';
import { UpdateGuestNameDto } from './dto/update-guestname.dto';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { Room } from './room.entity';
import { RoomMemberDocument } from './room.schema';
import { RoomControllService } from './services/room-controll.service';
import { RoomMemberService } from './services/room-member.service';
import { RoomService } from './services/room.service';

@Controller('room')
@ApiTags('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomMemberService: RoomMemberService,
    private readonly roomControllService: RoomControllService,
    private readonly userService: UserService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateRoomBodyDTO })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async create(@Body() createRoomBodyDto: CreateRoomBodyDTO): Promise<Room> {
    const createRoomDto = new CreateRoomDTO();
    createRoomDto.roomName = createRoomBodyDto.roomName;
    createRoomDto.owner = createRoomBodyDto.owner;
    createRoomDto.maxPeople = createRoomBodyDto.maxPeople;

    const room = await this.roomService.create(createRoomDto);
    await this.roomControllService.joinRoom(room.roomId, {
      userId: createRoomBodyDto.owner
    });
    return room;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  async findAll(): Promise<Room[]> {
    const result = await this.roomService.findAll();
    return result;
  }

  @Get('/:roomId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'roomId', type: Number })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async findOne(@Param('roomId') roomId: number): Promise<Room> {
    const result = await this.roomService.getRoom(roomId);
    return result;
  }

  @Put('/:roomId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'roomId', type: Number })
  @ApiBody({ type: UpdateRoomDTO })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async update(
    @Param('roomId') roomId: number,
    @Body() updateRoomDto: UpdateRoomDTO
  ): Promise<Room> {
    const result = await this.roomService.update(roomId, updateRoomDto);
    return result;
  }

  @Put('/:roomId/code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'roomId', type: Number })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse({ description: JSON.stringify(RoomError.ROOM_FAIL_INVITECODE) })
  async updateInviteCode(@Param('roomId') roomId: number): Promise<Room> {
    const room = await this.roomService.updateInviteCode(roomId);
    return room;
  }

  @Put('/:roomId/guestname')
  @ApiBody({ type: UpdateGuestNameDto })
  @ApiParam({ name: 'roomId', type: Number })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async updateGuestName(
    @Param('roomId') roomId: number,
    @Body() updateGuestNameDto: UpdateGuestNameDto
  ): Promise<RoomMemberDocument> {
    const { guestId, name } = updateGuestNameDto;
    const room = await this.roomControllService.changeGuestName(roomId, guestId, name);
    return room;
  }

  @Delete('/:roomId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'roomId', type: Number })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async delete(@Param('roomId') roomId: number): Promise<Room> {
    const room = await this.roomService.delete(roomId);
    await this.roomMemberService.deleteRoomMember(roomId);
    return room;
  }
}
