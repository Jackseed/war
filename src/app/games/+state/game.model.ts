export interface Game {
  id?: string | number;
  name?: string;
  status?: 'unit creation' | 'placement' | 'battle' | 'finished';
}

export const boardSize = 3;

/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    ...params
  };
}

