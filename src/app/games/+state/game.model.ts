export interface Game {
  id?: string | number;
  name?: string;
}


/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    ...params
  };
}

