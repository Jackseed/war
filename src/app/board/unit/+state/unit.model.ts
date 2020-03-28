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

export function createSoldier(params: Partial<Unit>): Unit {
  return {
    id: params.id,
    tileId: params.tileId,
    type: 'soldier',
    quantity: params.quantity,
    range: 1,
    move: 1,
    stamina: 1,
    vision: 1,
    noise: 1,
    playerId: params.id,
    ...params
  };
}
