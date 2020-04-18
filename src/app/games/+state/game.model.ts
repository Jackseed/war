export interface Game {
  id?: string;
  name?: string;
  status?: 'waiting' | 'unit creation' | 'placement' | 'battle' | 'finished';
  playerIds?: string[];
  playersReady?: string[];
}
export interface Castle {
  color: 'white' | 'black';
  x: number;
  y: number;
  tileId: number;
}

export const boardCols = 11;
export const boardMaxTiles = 1000;

export function Castle(color: 'white' | 'black'): Castle {
  return {
    color,
    get x(): number {
      if (this.color === 'white') {
        return 1;
      } else {
        return boardCols - Math.round(boardCols / 5);
      }
    },
    y: Math.round(boardCols / 2 - 1) * boardCols,
    get tileId(): number {
      return this.x + this.y;
    },
  };
}

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

