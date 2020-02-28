import { Tile } from '../../board/+state/board.model';

export interface Game {
  id?: string;
  name?: string;
  tiles?: Tile[];
}

/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    ...params
  };
}

