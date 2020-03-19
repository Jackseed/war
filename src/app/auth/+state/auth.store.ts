import { Injectable } from '@angular/core';
import { User } from './auth.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface AuthState extends EntityState<User> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends EntityStore<AuthState> {

  constructor() {
    super();
  }

}

