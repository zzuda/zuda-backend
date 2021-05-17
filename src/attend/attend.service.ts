import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendError } from 'src/shared/errors/attendance.error';

import { WordService } from '../word/word.service'

import { AttendBodyDTO } from './dto/attend-body.dto'

@Injectable()
export class AttendService {
    constructor(private readonly wordService : WordService) {}
 
// this method return room's Randowords or Quiz
createWord(attendBodyDTO: AttendBodyDTO): string {

    const {randomCount, type} = attendBodyDTO;

    if(type === "word"){

        const roomsRandomWords: string[] = [];
    
        // eslint-disable-next-line no-plusplus
        for(let i=1; i<=randomCount; i++){
            this.wordService.makeRandomWord().then(res =>{
                roomsRandomWords[i] = String(res);
            });

            
            
        }
     
    }

    if(type === "quiz"){
        // do something
    }
    else{
        throw new NotFoundException(AttendError.WRONG_ATTENDANCE_TYPE);
        // throw Exception
    }

    return 'Success';
  }

  
}