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
  unitCreationType?: 'soldier' | 'archer' | 'knight' | 'canon';
}

export interface TileUI {
  unit?: Unit;
  isVisible?: boolean;
  isReachable?: boolean;
  isSelected?: boolean;
}

/** A factory function that creates Tiles */
export function createTile(id: number, x: number, y: number,
                           unitCreationType?: 'soldier' | 'archer' | 'knight' | 'canon', params?: Partial<Tile>): Tile {
  return {
    id,
    x,
    y,
    unitCreationType,
    color: 'grey',
    ...params
  };
}
