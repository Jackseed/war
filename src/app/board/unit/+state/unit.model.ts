export interface Unit {
  id?: string | number;
  tileId?: number;
  type?: string;
  quantity?: number;
  range?: number;
  move?: number;
  stamina?: number;
  vision?: number;
  noise?: number;
}

export interface UnitUI {
  isSelected?: boolean;
}

export function createSoldier(params: Partial<Unit>): Unit {
  return {
    id: params.id,
    type: 'soldier',
    quantity: params.quantity,
    range: 1,
    move: 1,
    stamina: 1,
    vision: 1,
    noise: 1,
    ...params
  };
}
