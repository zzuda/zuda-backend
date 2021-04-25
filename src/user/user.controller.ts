import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    const result = await this.userService.create(createUserDTO);
    return result;
  }

  @Get()
  // TODO: 관리자만 사용할 수 있어야 함.
  async findAll(): Promise<User[]> {
    const result = await this.userService.findAll();
    return result;
  }

  @Get('/:uuid')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('uuid') uuid: string): Promise<User> {
    const result = await this.userService.findOneByUUID(uuid);
    return result;
  }

  @Put()
  // TODO: 제 3자 수정은 관리자만 가능해야 함. 자기 자신은 로그인한 사용자만 가능해야 함.
  async update(@Body() updateUserDTO: UpdateUserDTO): Promise<User> {
    const result = await this.userService.update(updateUserDTO);
    return result;
  }
}
