import faker from 'faker';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

type Either<T, TKey extends keyof T = keyof T> = TKey extends keyof T
  ? { [P in TKey]-?: T[TKey] } & Partial<Record<Exclude<keyof T, TKey>, never>>
  : never;

export const makeWordMock = (): string => {
  const words = ['과부족개발비', '로열티저급', '무임길가', '고깃배부진', '두건무심증'];
  return words[Math.floor(Math.random() * words.length)];
};

export const createUserMock = (
  userOptions: { uuid?: string; email?: string; name?: string } = {},
  authOptions: Either<{
    password?: string;
    vendor?: string;
  }>
): User => {
  const userMock = new User();
  userMock.uuid = userOptions.uuid || faker.datatype.uuid();
  userMock.email = userOptions.email || faker.internet.email();
  userMock.name = userOptions.name || faker.name.findName();
  userMock.vendor = authOptions.vendor;
  userMock.password = authOptions.password;
  return userMock;
};

export const createRoomMock = (
  options: {
    roomName?: string;
    maxPeople?: number;
    owner?: string;
    inviteCode?: string;
  } = {}
): Room => {
  const roomMock = new Room();
  roomMock.roomId = faker.datatype.number();
  roomMock.roomName = options.roomName || faker.name.title();
  roomMock.maxPeople = options.maxPeople || 3;
  roomMock.owner = options.owner || faker.datatype.uuid();
  roomMock.inviteCode = options.inviteCode || makeWordMock();
  return roomMock;
};
