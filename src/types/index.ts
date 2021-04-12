interface ErrorDetail {
  code: string;
  message: string;
}
export type ErrorInfo = Record<string, ErrorDetail>;
