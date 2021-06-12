import {Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {AttendError} from 'src/shared/errors/attendance.error';
import {CreatedWordReturn} from 'src/types';
import {Repository} from 'typeorm';
import {Attend} from './attend.entity'

import {WordService} from '../word/word.service';
import {RoomService} from '../room/services/room.service'

import {AttendBodyDTO} from './dto/attend-body.dto';
import { CreateAttendDTO } from './dto/create-attend.dto';

@Injectable()
export class AttendService {
    constructor(
        private readonly wordService : WordService,
        private readonly roomService : RoomService,

        @InjectRepository(Attend)private readonly attendRepository : Repository<Attend>
    ) {}

    // this method return room's RandomWords or Quiz
    async createWord(attendBodyDTO : AttendBodyDTO, ): Promise<CreatedWordReturn> {
        const {roomId, randomCount, type} = attendBodyDTO;

        if (type === 'word') {

            if (await this.roomService.existsRoom(roomId) === false) {
                throw new ConflictException(AttendError.ROOM_NOT_FOUND);
            }

            const Words = [];
            // eslint-disable-next-line no-plusplus
            for (let i = 1; i <= randomCount; i++) {
                Words.push(this.wordService.makeRandomWord());
            }

            const results = await Promise.all(Words);

            // put in to AttendWord Repository (DB Table)
            // const attendTable = new Attend();
            // attendTable.roomId = createAttendDTO.roomId;
            // attendTable.words = createAttendDTO.words;

            // await this.attendRepository.save(attendTable)
            


            return {message: '초대 코드가 생성되었습니다.', count: randomCount, words: results};

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
}
