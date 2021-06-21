import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {AttendError} from 'src/shared/errors/attendance.error';
import {CreatedWordReturn} from 'src/types';
import {Repository} from 'typeorm';
import {Attend} from './attend.entity'

import {WordService} from '../word/word.service';
import {RoomService} from '../room/services/room.service'

import {AttendBodyDTO} from './dto/attend-body.dto';

@Injectable()
export class AttendService {
    constructor(
        private readonly wordService : WordService,
        private readonly roomService : RoomService,

        @InjectRepository(Attend)private readonly attendRepository : Repository<Attend>
    ) {}

    // this method return room's RandomWords or Quiz
    async createWord(attendBodyDTO : AttendBodyDTO ): Promise<CreatedWordReturn> {
        const {roomId, randomCount, type} = attendBodyDTO;

        if (type === 'word') {
            
<<<<<<< HEAD
<<<<<<< HEAD
           if (await this.roomService.existsRoom(roomId) === false) {
=======
            
            if (await this.roomService.existsRoom(roomId) === false) {
>>>>>>> parent of 9565286 (fix: 출석코드 여부 검사)
                throw new NotFoundException(AttendError.ROOM_NOT_EXIST);
            }

<<<<<<< HEAD
            if (await this.isAttendExist(roomId) === true){
                throw new ConflictException(AttendError.CODE_ALREADY_EXIST);
            }
            
                const words = [];
=======
=======
            
            if (await this.roomService.existsRoom(roomId) === false) {
                throw new NotFoundException(AttendError.ROOM_NOT_EXIST);
            }

>>>>>>> parent of 9565286 (fix: 출석코드 여부 검사)
           if (await this.existAttendCode(roomId) === true){
               throw new ConflictException(AttendError.CODE_ALREADY_EXIST);
           }

            const words = [];
<<<<<<< HEAD
>>>>>>> parent of 9565286 (fix: 출석코드 여부 검사)
=======
>>>>>>> parent of 9565286 (fix: 출석코드 여부 검사)
            // eslint-disable-next-line no-plusplus
            for (let i = 1; i <= randomCount; i++) {
                words.push(this.wordService.makeRandomWord());

            }
            const wordList = await Promise.all(words);
            
            // put in to AttendWord Repository (DB Table)
            const attendTable = new Attend();
            attendTable.words = wordList;
            attendTable.roomId = roomId;

            await this.attendRepository.save(attendTable)
            


            return {message: '초대 코드가 생성되었습니다.', count: randomCount, words: wordList};

        }

        if (type === 'quiz') {
            // do something

            const word: string[] = []

            return {message: '초대 코드가 생성되었습니다.', count: randomCount, words: word};
        }

        if (type !== 'quiz' && type !== 'word') {
            throw new NotFoundException(AttendError.WRONG_ATTENDANCE_TYPE);
        }

        return {message: "what should I do?", count: 0, words: []}
    }

    // this function is for validate attend code is already Exist :)
    async existAttendCode(roomId: number): Promise<boolean>{
        const attendExist = await this.attendRepository.findOne(roomId);
        if(attendExist) {return true}
        
        return false
    }
    
}
