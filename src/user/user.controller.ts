import { Body, Controller, Get, Post, Put } from '@nestjs/common';  //Entry 포인트 역할을 하는 Controller와 Get/Put 을 사용하기 위해 import 시켜줌
import { UpdateUserDTO } from './dto/update-user.dto';        // 업데이트 할 종류와 정보가 담긴 UpdateUserDTO 클래스를 dto/update-user.dto으로 부터 가져옴
import { CreateUserDTO } from './dto/create-user.dto';        // 생성할 종류와 정보가 담긴 CreateUserDTO  클래스를 dto/create-uesr.dto으로 부터 가져옴

import { User } from './user.model';                          // 'zuda' 데이터 베이스에 'users' 테이블에 담긴 필요한 key값들을 가져옴
import { UserService } from './user.service';                 // Controller로 라우팅 되는 정보들을 처리하는 UserService 부분을 import 시켜주었음

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

//POST 를 이용하여 uuid 생성
  @Post()
  async create(@Body() createUserDTO: CreateUserDTO){ //Body로 createUserDto변수는, 임포트한 CreateUserDto 규칙에 따라 userSerice에 create 함수로 createUserDto변수값을 전송 
    const result = await this.userService.create(createUserDTO);  //userSerive에 create 함수로 createUserDto변수를 전송하여 나온 결과값을 return (리턴) 
    return result;
  }

  @Get() //Get 데코레이터 : Get 요청을 작업하는 역할
  async findAll(): Promise<User[]> { //asnyc(비동기 작업)로 사용하는 정보로는 User 배열이 있음, Promise 사용
    const result = await this.userService.findAll(); // 반환되는 result는 userService를 호출하여 그곳에서 uuid 등등 여러가지 정보를 생성
    return result;                                    // 결과값을 리턴 (여기서 여러가지 오류같은 것도 userService에서 같이 return 할듯)
  }

  @Put() //Put 데코레이터 : 유저 정보를 수정할때 쓰는 듯함
  async update(@Body() updateUserDTO: UpdateUserDTO): Promise<User> { //async (비동기 작업)으로  Put에 Body로 DTO가 들어옴 (DTO는 body 정보로써 uuid, name, password가 들어옴) 아니면 이상한 정보가 들어오면 Validation Pipe가 거를듯?
    const result = await this.userService.update(updateUserDTO);    //반환되는 result는 userService를 호출하여 그곳에서 작업을 해주어 보내줌 (예정)
    return result;                                                  // 결과값을 리턴 (여기서 여러가지 오류같은 것도 userService에서 같이 return 할듯)
  }
}
