export interface User {
  id: string;
}

export function createUser(params: Partial<User>) {
  return {
    id: params.id,
  };
}
