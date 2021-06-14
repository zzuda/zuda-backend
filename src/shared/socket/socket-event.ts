const events = {
  JOIN: 'join',
  JOIN_OWNER: 'joinOwner',
  QUIT: 'quit',
  KICK: 'kick',
  KICK_COMPLETE: 'kickComplete'
} as const;

export const SocketEvent = events as Record<keyof typeof events, string>;
