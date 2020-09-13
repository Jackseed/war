export interface Player {
  id: string;
  color?: "white" | "black";
  isActive?: boolean;
  actionCount?: number;
  isVictorious?: boolean;
  wins?: number;
}

/** A factory function that creates Player */
export function createPlayer(params: Partial<Player> = {}): Player {
  return {
    id: params.id,
    color: params.color,
    isActive: params.isActive,
    actionCount: 0,
    wins: 0,
    ...params,
  };
}
