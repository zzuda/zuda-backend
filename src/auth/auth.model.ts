export interface IToken {
  uuid?: string;
  TOKEN?: string;
  REFRESH_TOKEN?: string;
  verify?: string;
}

export default class implements IToken {
  uuid?: string;

  TOKEN?: string;

  REFRESH_TOKEN?: string;
}
