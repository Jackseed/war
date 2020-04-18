export interface Game {
  id?: string;
  name?: string;
  status?: 'waiting' | 'unit creation' | 'placement' | 'battle' | 'finished';
  playerIds?: string[];
  playersReady?: string[];
}

export const boardCols = 11;
export const boardMaxTiles = 1000;
export const whiteCastleId = 1 + Math.round(boardCols / 2 - 1) * boardCols;
export const blackCastleId = boardCols - Math.round(boardCols / 5) + Math.round(boardCols / 2 - 1) * boardCols;

/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    status: 'waiting',
    playersReady: [],
    playerIds: params.playerIds,
    ...params
  };
}

