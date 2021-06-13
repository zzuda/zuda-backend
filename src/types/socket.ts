export interface JoinSocketRequest {
  readonly inviteCode: string;
  readonly name: string;
}

export interface QuitSocketRequest {
  readonly roomId: number;
  readonly guestId: string;
}

export interface JoinOwnerSocketRequest {
  readonly roomId: number;
  readonly ownerId: string;
}
