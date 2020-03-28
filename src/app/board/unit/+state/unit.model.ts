import { guid } from '@datorama/akita';

export interface Unit {
  id?: string;
  tileId?: number;
  type?: 'soldier' | 'archer' | 'knight' | 'canon';
  quantity?: number;
  range?: number;
  move?: number;
  stamina?: number;
  vision?: number;
  noise?: number;
  isSelected?: boolean;
  isOpponent?: boolean;
  playerId?: string | number;
}

export interface UnitUI {
  isOpponent?: boolean;
  isSelected?: boolean;
}

export const unitBoardSize = 3;

export function createSoldier(id: string, playerId: string, tileId?: number, params?: Partial<Unit>): Unit {
  return {
    id,
    playerId,
    tileId,
    type: 'soldier',
    quantity: 10,
    range: 1,
    move: 1,
    stamina: 1,
    vision: 1,
    noise: 1,
    ...params
  };
}


