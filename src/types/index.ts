import { User } from 'src/user/user.model';

interface ErrorDetail {
  code: string;
  message: string;
}
export type ErrorInfo = Record<string, ErrorDetail>;

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
