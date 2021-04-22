export interface JoinSocketRequest {
  readonly roomId: number;
}

export interface QuitSocketRequest {
  readonly roomId: number;
  readonly userId: string;
}
