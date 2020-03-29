export interface Game {
  id?: string;
  name?: string;
  status?: 'unit creation' | 'placement' | 'battle' | 'finished';
}

export const boardCols = 10;
export const boardMaxTiles = 1000;

/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    ...params
  };
}

