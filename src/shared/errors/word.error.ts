import { ErrorInfo } from 'src/types';

const errors = {
  WORD_NOT_FOUND: {
    code: 'word-404',
    message: '단어를 찾을 수 없습니다.'
  }
} as const;

export const WordError = errors as ErrorInfo<typeof errors>;
