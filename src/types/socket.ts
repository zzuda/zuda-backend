export interface JoinSocketRequest {
  readonly inviteCode: string;
}

export interface QuitSocketRequest {
  readonly roomId: number;
  readonly userId: string;
}
