import { ErrorInfo } from 'src/types';

const errors = {
  WRONG_ATTENDANCE_TYPE: {
    code: 'WRONG_ATTENDANCE_TYPE',
    message: '해당 attendance 타입은 존재하지 않습니다.'
  },
  ROOM_ALREADY_EXIST: {
    code: 'ROOM_ALREADY_EXIST',
    message: '해당 방의 초대 코드가 이미 생성되어 있습니다.'
  }
} as const;

export const AttendError = errors as ErrorInfo<typeof errors>;
