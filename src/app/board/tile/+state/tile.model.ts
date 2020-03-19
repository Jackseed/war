import { Unit } from '../../unit/+state/unit.model';

export interface Tile {
  id?: number | number;
  color?: string;
  x?: number;
  y?: number;
  unitId?: string;
  unit?: Unit;
  visible?: boolean;
  possibleMove?: boolean;
}

/** A factory function that creates Tiles */
export function createTile(params: Partial<Tile> = {}): Tile {
  return {
    id: params.id,
    color: params.color,
    x: params.x,
    y: params.y,
    unitId: params.unitId,
    unit: params.unit,
    visible: params.visible,
    possibleMove: params.possibleMove,
    ...params
  };
}
