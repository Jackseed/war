export interface Game {
  id?: string | number;
  name?: string;
}

export interface Player {
  userId?: string;
  isActive?: boolean;
}

/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    ...params
  };
}

/** A factory function that creates Player */
export function createPlayer(params: Partial<Player> = {}): Player {
  return {
    userId: params.userId,
    isActive: false,
    ...params
  };
}