import {Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import {AttendError} from 'src/shared/errors/attendance.error';
import {CreatedWordReturn} from 'src/types';

import {WordService} from '../word/word.service';
import {RoomService} from '../room/services/room.service'

import {AttendBodyDTO} from './dto/attend-body.dto';

@Injectable()
export class AttendService {
    constructor(
        private readonly wordService : WordService,
        private readonly roomService : RoomService
    ) {}

    // this method return room's Randowords or Quiz
    async createWord(attendBodyDTO : AttendBodyDTO): Promise<CreatedWordReturn> {
        const {roomID ,randomCount, type} = attendBodyDTO;

        if (type === 'word') {

          if(await this.roomService.existsRoom(roomID) === true){
              AttendError.
          }

            const Words = [];
            // eslint-disable-next-line no-plusplus
            for (let i = 1; i <= randomCount; i++) {
                Words.push(this.wordService.makeRandomWord());
            }

            const results = await Promise.all(Words);

            return {
              message: '초대 코드가 생성되었습니다.', 
              count: randomCount, 
              words: results};
        }

        if (type === 'quiz') {
            // do something

            return {message: '초대 코드가 생성되었습니다.', count: randomCount, words: roomsRandomWords};
        }
        if (type !== 'quiz' && type !== 'word') {
            throw new NotFoundException(AttendError.WRONG_ATTENDANCE_TYPE);
        }
        return {
          message: "what should I do?", 
          count: 0, 
          words: []
        }
    }
}
