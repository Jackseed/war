export interface User {
  id: string;
  name?: string;
  gamePlayed?: string[];
  gameWon?: number;
}

export function createUser(params: Partial<User>) {
  return {
    id: params.id,
    name: "Vagabond",
    gamePlayed: [],
    gameWon: 0,
  };
}
