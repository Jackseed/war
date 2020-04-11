export interface Game {
  id?: string;
  name?: string;
  status?: 'unit creation' | 'placement' | 'battle' | 'finished';
  playerIds?: string[];
  playersReady?: string[];
}

export const boardCols = 10;
export const boardMaxTiles = 1000;

/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    status: 'unit creation',
    playersReady: [],
    playerIds: params.playerIds,
    ...params
  };
}

