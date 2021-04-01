import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const result = this.userModel.create(createUserDTO);
    return result;
  }
}
