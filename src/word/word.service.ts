import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordError } from 'src/shared/errors/word.error';
import { Repository } from 'typeorm';
import { Word } from './word.entity';

@Injectable()
export class WordService {
  constructor(@InjectRepository(Word) private readonly userRepository: Repository<Word>) {}

  private WORD_COUNT = 23799;

  async get(id: number): Promise<Word> {
    const result = await this.userRepository.findOne(id);

    if (!result) throw new NotFoundException(WordError.WORD_NOT_FOUND);

    return result;
  }

  async makeRandomWord(): Promise<string> {
    const rand1 = Math.floor(Math.random() * this.WORD_COUNT) + 1;
    const rand2 = Math.floor(Math.random() * this.WORD_COUNT) + 1;

    const word1 = await this.get(rand1);
    const word2 = await this.get(rand2);

    return `${word1.word}${word2.word}`;
  }
}
