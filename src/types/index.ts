interface ErrorDetail {
  code: string;
  message: string;
}
export type ErrorInfo = Record<string, ErrorDetail>;

export interface TokenReturn {
  TOKEN: string;
}

export interface RefreshTokenReturn {
  REFRESH_TOKEN: string;
}
