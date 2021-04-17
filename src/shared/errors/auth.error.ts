import { ErrorInfo } from 'src/types';

export const AuthError: ErrorInfo = {
  INVALID_TOKEN: {
    code: 'auth-401',
    message: '유효하지 않은 토큰입니다.'
  },
  PERMISSION: {
    code: 'auth-401-1',
    message: '권한이 없습니다.'
  }
};
