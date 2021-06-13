import { Room } from 'src/room/room.entity';
import { User } from 'src/user/user.entity';

interface ErrorDetail {
  code: string;
  message: string;
}
export type ErrorInfo<T extends Record<string, unknown>> = Record<keyof T, ErrorDetail>;

export interface TokenReturn {
  readonly TOKEN: string;
}

export interface RefreshTokenReturn {
  readonly REFRESH_TOKEN: string;
}

export interface AuthReturn {
  readonly user: User;
  readonly token: string;
}

export interface JwtPayload {
  readonly iat: number;
  readonly exp: number;
  readonly uuid: string;
}

export interface RoomInteractReturn {
  readonly id: string;
  readonly roomInfo: Room;
}

export interface CreatedWordReturn {
  readonly message: string;
  readonly count: number;
  readonly words: string[];
}
