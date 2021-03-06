export interface User {
  id: string;
  name?: string;
  gamePlayed?: string[];
  matchPlayed?: number;
  matchWon?: number;
  rank?: number;
  email?: string;
  oldId?: string;
  fcmTokens?: { [token: string]: true };
}

export function createUser(params: Partial<User>) {
  return {
    id: params.id,
    name: "Vagabond",
    gamePlayed: [],
    matchPlayed: 0,
    matchWon: 0,
    fcmTokens: {}
  };
}
