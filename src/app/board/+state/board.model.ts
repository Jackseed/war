export interface Tile {
  id?: number;
  color?: string;
  x?: number;
  y?: number;
  unitId?: string;
}

export interface Unit {
  id?: string;
  tileId?: number;
  type?: string;
  quantity?: number;
  range?: number;
  move?: number;
  stamina?: number;
  vision?: number;
  noise?: number;
}

/** A factory function that creates Tiles */
export function createTile(params: Partial<Tile> = {}): Tile {
  return {
    id: params.id,
    color: params.color,
    x: params.x,
    y: params.y,
    unitId: params.unitId,
    ...params
  };
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
