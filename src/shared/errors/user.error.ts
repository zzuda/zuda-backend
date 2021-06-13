import { ErrorInfo } from 'src/types';

const errors = {
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '존재하지 않는 계정입니다.'
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: '이미 존재하는 계정입니다.'
  }
} as const;

export const UserError = errors as ErrorInfo<typeof errors>;
