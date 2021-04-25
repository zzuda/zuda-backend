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
  },
  GUEST_ALREADY_JOIN: {
    code: 'room-409-1',
    message: '같은 사용자가 이미 입장하였습니다.'
  },
  GUEST_NOT_FOUND: {
    code: 'room-404-2',
    message: '방에 입장하지 않은 사용자입니다.'
  },
  ROOM_NAME_USED: {
    code: 'room-409-2',
    message: '이미 사용 중인 방 이름입니다.'
  }
};
