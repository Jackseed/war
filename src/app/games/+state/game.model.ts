export interface Game {
  id?: string;
  name?: string;
  status?: "waiting" | "unit creation" | "placement" | "battle" | "finished";
  playerIds?: string[];
  playersReady?: string[];
  playersRematch?: string[];
  turnCount?: number;
  matchs?: number;
  isInstant?: boolean;
  isClosed?: boolean,
}

export interface Castle {
  color: "white" | "black";
  x: number;
  y: number;
  tileId: number;
  vision: number;
}


export const decoTimer = 60;

/// TODO push to firebase
export const boardCols = 11;
export const boardMaxTiles = 1000;
export const actionsPerTurn = 3;
export const unitPlacementMargin = 2;

export function Castle(color: "white" | "black"): Castle {
  const xCastle = 1;
  const yCastle = Math.floor(boardCols / 2);
  return {
    color,
    get x(): number {
      if (this.color === "white") {
        return xCastle;
      } else {
        return boardCols - (xCastle + 1);
      }
    },
    y: yCastle,
    get tileId(): number {
      return this.x + this.y * boardCols;
    },
    vision: 1,
  };
}

/** A factory function that creates Game */
export function createGame(params: Partial<Game> = {}): Game {
  return {
    id: params.id,
    name: params.name,
    status: "waiting",
    playersReady: [],
    playersRematch: [],
    playerIds: params.playerIds,
    turnCount: 0,
    matchs: 1,
    isInstant: params.isInstant,
    isClosed: false,
    ...params,
  };
}
