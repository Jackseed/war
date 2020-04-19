export interface Player {
  id: string;
  color?: 'white' | 'black';
  isActive?: boolean;
  actionPlayed?: number;
  isVictorious?: boolean;
}

/** A factory function that creates Player */
export function createPlayer(params: Partial<Player> = {}): Player {
  return {
    id: params.id,
    color: params.color,
    isActive: params.isActive,
    actionPlayed: 0,
    ...params
  };
}
