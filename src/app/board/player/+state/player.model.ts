export interface Player {
  id: string;
  color?: 'white' | 'black';
  isActive?: boolean;
  actionCount?: number;
  isVictorious?: boolean;
}

/** A factory function that creates Player */
export function createPlayer(params: Partial<Player> = {}): Player {
  return {
    id: params.id,
    color: params.color,
    isActive: params.isActive,
    actionCount: 0,
    ...params
  };
}
