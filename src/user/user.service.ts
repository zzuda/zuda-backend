import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from '../shared/dto/create-user.dto';
import { User } from './user.model';
import { UserError } from '../shared/errors/user.error';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly config: ConfigService
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const { email, password } = createUserDTO;
    const exists = await this.existsUserByEmail(email);

    if (exists) throw new ConflictException(UserError.USER_ALREADY_EXISTS);

    let hashed: string | undefined;
    if (password) {
      hashed = await bcrypt.hash(password, this.config.get<number>('SALT_ROUND', 12));
    }

    const result = this.userModel.create({
      uuid: uuidv4(),
      password: hashed,
      ...createUserDTO
    });

    return result;
  }

  async existsUserByEmail(email: string): Promise<boolean> {
    try {
      const exists = await this.findOneByEmail(email);
      if (exists) {
        return true;
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        return false;
      }
    }

    return false;
  }

  async existsUserByUUID(uuid: string): Promise<boolean> {
    try {
      const exists = await this.findOneByUUID(uuid);
      if (exists) {
        return true;
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        return false;
      }
    }

    return false;
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

  async update(updateUserDTO: UpdateUserDTO): Promise<User> {
    const result = await this.findOneByUUID(updateUserDTO.uuid);
    await result.update(updateUserDTO);
    return result;
  }

  async delete(uuid: string): Promise<User> {
    const result = await this.findOneByUUID(uuid);
    await result.destroy();
    return result;
  }
}
