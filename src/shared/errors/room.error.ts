import { ErrorInfo } from 'src/types';

export const RoomError: ErrorInfo = {
  ROOM_NOT_FOUND: {
    code: 'room-404',
    message: '존재하지 않는 방입니다.'
  },
  ROOM_IS_FULL: {
    code: 'room-409',
    message: '방이 꽉찼습니다.'
  },
  INVITE_CODE_NOT_FOUND: {
    code: 'room-404-1',
    message: '올바르지 않은 초대코드입니다.'
  }
};
