import { ErrorInfo } from 'src/types';

export const UserError: ErrorInfo = {
  USER_NOT_FOUND: {
    code: 'user-404',
    message: '존재하지 않는 계정입니다.'
  },
  USER_ALREADY_EXISTS: {
    code: 'user-409',
    message: '이미 존재하는 계정입니다.'
  }
};
