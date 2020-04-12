import { Unit } from '../../unit/+state';

export interface Tile {
  id?: number;
  x?: number;
  y?: number;
  isVisible?: boolean;
  isReachable?: boolean;
  isSelected?: boolean;
  unit?: Unit;
}

/** A factory function that creates Tiles */
export function createTile(id: number, x: number, y: number, params?: Partial<Tile>): Tile {
  return {
    id,
    x,
    y,
    ...params
  };
}
