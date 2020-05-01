export interface Unit {
  id?: string;
  tileId?: number;
  color?: "white" | "black";
  type?: "soldier" | "musketeer" | "knight" | "cannon";
  quantity?: number;
  range?: number;
  move?: number;
  hp?: number;
  power?: number;
  stamina?: number;
  vision?: number;
  noise?: number;
  playerId?: string | number;
}

export const unitCols = 10;
export const unitMaxTiles = 10;

export function createUnit(
  unitType: "soldier" | "musketeer" | "knight" | "cannon",
  id?: string,
  playerId?: string,
  color?: "white" | "black",
  tileId?: number,
  params?: Partial<Unit>
): Unit {
  if (unitType === "soldier") {
    return {
      id,
      playerId,
      color,
      tileId,
      type: "soldier",
      quantity: 10,
      hp: 2,
      power: 1,
      range: 1,
      move: 1,
      stamina: 1,
      vision: 1,
      noise: 1,
      ...params,
    };
  } else if (unitType === "musketeer") {
    return {
      id,
      playerId,
      color,
      tileId,
      type: "musketeer",
      quantity: 10,
      hp: 1,
      power: 1,
      range: 2,
      move: 1,
      stamina: 1,
      vision: 1,
      noise: 1,
      ...params,
    };
  } else if (unitType === "knight") {
    return {
      id,
      playerId,
      color,
      tileId,
      type: "knight",
      quantity: 10,
      hp: 1,
      power: 1,
      range: 1,
      move: 2,
      stamina: 1,
      vision: 1,
      noise: 1,
      ...params,
    };
  } else if (unitType === "cannon") {
    return {
      id,
      playerId,
      color,
      tileId,
      type: "cannon",
      quantity: 5,
      hp: 1,
      range: 3,
      power: 3,
      move: 2,
      stamina: 1,
      vision: 1,
      noise: 1,
      ...params,
    };
  }
}
