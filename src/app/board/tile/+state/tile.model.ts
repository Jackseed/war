import { Unit } from '../../unit/+state';

export interface Tile {
  id?: number;
  color?: string;
  x?: number;
  y?: number;
  isVisible?: boolean;
  isReachable?: boolean;
  isSelected?: boolean;
  unit?: Unit;
  unitCreationType?: 'soldier' | 'archer' | 'knight' | 'cannon';
}

export interface TileUI {
  unit?: Unit;
  isVisible?: boolean;
  isReachable?: boolean;
  isSelected?: boolean;
}

/** A factory function that creates Tiles */
export function createTile(id: number, x: number, y: number, params?: Partial<Tile>): Tile {
  return {
    id,
    x,
    y,
    color: 'grey',
    ...params
  };
}
