import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {AttendError} from 'src/shared/errors/attendance.error';
import {AttendedListReturn, CreatedWordReturn} from 'src/types';
import {Repository, getConnection} from 'typeorm';
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
            
            
          
          
           if (await this.roomService.existsRoom(roomId) === false) {
                throw new NotFoundException(AttendError.ROOM_NOT_EXIST);

            }

        if (await this.isAttendExist(roomId) === true){
            throw new ConflictException(AttendError.CODE_ALREADY_EXIST);
        }
            
                const words = [];
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
    async getAttendCode(roomId: number): Promise<Attend>{
        const existAttend = await this.attendRepository.findOne({roomId});

        if(!existAttend) throw new NotFoundException();

        return existAttend;
    }

    async isAttendExist(roomId: number): Promise<boolean>{
        try{
            const existAttend = await this.getAttendCode(roomId);
            if(existAttend) return true;
            
        }catch (e) {
            if(e instanceof NotFoundException){
                return false;
               
            }
        }
        return false;
    }



    // get(return) attended user list
    async getList(roomId: number): Promise<AttendedListReturn>{
      

        const wordStringList: unknown = await getConnection()
        .createQueryBuilder()
        .select("words")
        .from(Attend, "words")
        .where("attend.roomId = :roomId", {roomId})
        .getOne();

        // eslint-disable-next-line no-console
        console.log(wordStringList);
        

        const testWordList: string[] = []

        return{roomId, words: testWordList}
    }

}
