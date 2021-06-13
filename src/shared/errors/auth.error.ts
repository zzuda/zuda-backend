import { ErrorInfo } from 'src/types';

const errors = {
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: '유효하지 않은 토큰입니다.'
  },
  PERMISSION: {
    code: 'PERMISSION',
    message: '권한이 없습니다.'
  },
  EMAIL_OR_PASSWORD_ERROR: {
    code: 'EMAIL_OR_PASSWORD_ERROR',
    message: '없는 계정이거나 비밀번호가 올바르지 않습니다.'
  }
} as const;

export const AuthError = errors as ErrorInfo<typeof errors>;
