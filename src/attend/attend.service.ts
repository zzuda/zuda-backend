import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendError } from 'src/shared/errors/attendance.error';
import { CreatedWordReturn } from 'src/types';

import { WordService } from '../word/word.service';

import { AttendBodyDTO } from './dto/attend-body.dto';

@Injectable()
export class AttendService {
  constructor(private readonly wordService: WordService) {}

  // this method return room's Randowords or Quiz
  async createWord(attendBodyDTO: AttendBodyDTO): Promise<CreatedWordReturn> {
    const { randomCount, type } = attendBodyDTO;

    
    const roomsRandomWords: string[] = [];

    if (type === 'word') {

    
    const promises = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= randomCount; i++) {
      promises.push(this.wordService.makeRandomWord());
    }

    const results = await Promise.all(promises);

    // eslint-disable-next-line no-console
    // console.log(results);
    
    
      // roomsRandomWords = promises.slice();
      
      // eslint-disable-next-line no-console
      // console.log(roomsRandomWords);

    
      

      return {
        message: '초대 코드가 생성되었습니다.',
        count: randomCount,
        words: results
      };
    }

    if (type === 'quiz') {
      // do something

      return {
        message: '초대 코드가 생성되었습니다.',
        count: randomCount,
        words: roomsRandomWords
      };
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
