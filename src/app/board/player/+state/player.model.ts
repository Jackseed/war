export interface Player {
  userId?: string;
  isActive?: boolean;
}

/** A factory function that creates Player */
export function createPlayer(params: Partial<Player> = {}): Player {
  return {
    userId: params.userId,
    isActive: false,
    ...params
  };
}
