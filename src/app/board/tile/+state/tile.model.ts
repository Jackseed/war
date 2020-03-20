import { Unit } from '../../unit/+state';

export interface Tile {
  id?: string | number;
  color?: string;
  x?: number;
  y?: number;
}

export interface TileUI {
  isVisible?: boolean;
  isReachable?: boolean;
  unit: Unit;
}

/** A factory function that creates Tiles */
export function createTile(params: Partial<Tile> = {}): Tile {
  return {
    id: params.id,
    color: params.color,
    x: params.x,
    y: params.y,
    ...params
  };
}
