export interface Player {
  id: string;
  color?: 'white' | 'black';
  isActive?: boolean;
}
export interface PlayerUI {
  isOpponent: boolean;
}
/** A factory function that creates Player */
export function createPlayer(params: Partial<Player> = {}): Player {
  return {
    id: params.id,
    color: params.color,
    isActive: false,
    ...params
  };
}
