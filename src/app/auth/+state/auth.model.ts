export interface User {
  id: string;
  name?: string;
  gamePlayed?: {
    gameId: string;
    matchWon: number;
  }[];
  totalMatchWon?: number;
  rank?: number;
  email?: string;
  oldId?: string;
}

export function createUser(params: Partial<User>) {
  return {
    id: params.id,
    name: "Vagabond",
    gamePlayed: [],
    totalMatchWon: 0,
  };
}
