import { Body, Controller, Get, Put } from '@nestjs/common';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    const result = await this.userService.findAll();
    return result;
  }

  @Put()
  async update(@Body() updateUserDTO: UpdateUserDTO): Promise<User> {
    const result = await this.userService.update(updateUserDTO);
    return result;
  }
}
