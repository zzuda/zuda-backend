import { ErrorInfo } from 'src/types';

const errors = {
  ROOM_NOT_FOUND: {
    code: 'ROOM_NOT_FOUND',
    message: '존재하지 않는 방입니다.'
  },
  ROOM_IS_FULL: {
    code: 'ROOM_IS_FULL',
    message: '방이 꽉찼습니다.'
  },
  INVITE_CODE_NOT_FOUND: {
    code: 'INVITE_CODE_NOT_FOUND',
    message: '올바르지 않은 초대코드입니다.'
  },
  GUEST_ALREADY_JOIN: {
    code: 'GUEST_ALREADY_JOIN',
    message: '같은 사용자가 이미 입장하였습니다.'
  },
  GUEST_NOT_FOUND: {
    code: 'GUEST_NOT_FOUND',
    message: '방에 입장하지 않은 사용자입니다.'
  },
  ROOM_NAME_USED: {
    code: 'ROOM_NAME_USED',
    message: '이미 사용 중인 방 이름입니다.'
  },
  ROOM_FAIL_INVITECODE: {
    code: 'ROOM_FAIL_INVITECODE',
    message: '초대코드 생성을 실패하였습니다. 다시 시도해주세요.'
  },
  OWNER_CAN_NOT_QUIT: {
    code: 'OWNER_CAN_NOT_QUIT',
    message: '방장은 방을 나갈 수 없습니다. 방 삭제를 이용해주세요.'
  },
  OWNER_CAN_NOT_KICK: {
    code: 'OWNER_CAN_NOT_KICK',
    message: '방장은 추방할 수 없습니다.'
  }
} as const;

export const RoomError = errors as ErrorInfo<typeof errors>;
