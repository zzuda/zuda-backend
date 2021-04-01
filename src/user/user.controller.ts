import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createdUserDTO: CreateUserDTO): Promise<User> {
    const result = await this.userService.create(createdUserDTO);
    return result;
  }
}
