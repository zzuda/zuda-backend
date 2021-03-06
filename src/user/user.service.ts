import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserError } from '../shared/errors/user.error';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly config: ConfigService
  ) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const { email, password } = createUserDTO;
    const exists = await this.existsUserByEmail(email);

    if (exists) throw new ConflictException(UserError.USER_ALREADY_EXISTS);

    const hashRound = parseInt(this.config.get('SALT_ROUND', '12'), 10);
    let hashed: string | undefined;
    if (password) {
      hashed = await bcrypt.hash(password, hashRound);
    }

    const result = new User();
    result.uuid = uuidv4();
    result.password = hashed;
    result.email = createUserDTO.email;
    result.vendor = createUserDTO.vendor;
    result.name = createUserDTO.name;
    await this.userRepository.save(result);

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
    const result = await this.userRepository.find();
    return result;
  }

  async findOneByUUID(uuid: string): Promise<User> {
    const result = await this.userRepository.findOne({
      uuid
    });

    if (!result) {
      throw new NotFoundException(UserError.USER_NOT_FOUND);
    }

    return result;
  }

  async findOneByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOne({
      email
    });

    if (!result) {
      throw new NotFoundException(UserError.USER_NOT_FOUND);
    }

    return result;
  }

  async update(uuid: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    const current = await this.findOneByUUID(uuid);
    const result = await this.userRepository.save({
      ...current,
      ...updateUserDTO
    });
    return result;
  }

  async delete(uuid: string): Promise<User> {
    const result = await this.findOneByUUID(uuid);
    await this.userRepository.softRemove(result);
    return result;
  }
}
