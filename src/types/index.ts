interface ErrorDetail {
  code: string;
  message: string;
}
export type ErrorInfo = Record<string, ErrorDetail>;

export interface IToken {
  uuid?: string;
  TOKEN?: string;
  REFRESH_TOKEN?: string;
  verify?: string;
}
