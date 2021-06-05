import { ErrorInfo } from 'src/types';

export const AttendError: ErrorInfo = {
  WRONG_ATTENDANCE_TYPE: {
    code: 'attend-404',
    message: '해당 attendance 타입은 존재하지 않습니다.'
  },
  ROOM_ALREADY_EXIST: {
    code: 'attend-409',
    message: '해당 방의 초대 코드가 이미 생성되어 있습니다.'
  },
};
