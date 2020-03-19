export interface User {
  id: string | number;
}

export function createUser(params: Partial<User>) {
  return {
    id: params.id,
  };
}
