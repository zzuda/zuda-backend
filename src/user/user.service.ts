import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.model';
import { UserError } from '../shared/errors/user.error';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const result = this.userModel.create({
      uuid: uuidv4(),
      ...createUserDTO
    });
    return result;
  }

  async findAll(): Promise<User[]> {
    const result = this.userModel.findAll();
    return result;
  }

  async findOneByUUID(uuid: string): Promise<User> {
    const result = await this.userModel.findOne({
      where: {
        uuid
      }
    });

    if (!result) {
      throw new NotFoundException(UserError.USER_NOT_FOUND);
    }

    return result;
  }

  async findOneByEmail(email: string): Promise<User> {
    const result = await this.userModel.findOne({
      where: {
        email
      }
    });

    if (!result) {
      throw new NotFoundException(UserError.USER_NOT_FOUND);
    }

    return result;
  }
}
