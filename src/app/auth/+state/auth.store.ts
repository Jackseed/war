import { Injectable } from '@angular/core';
import { User } from './auth.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';

export interface AuthState extends EntityState<User>, ActiveState<string> {}

const initialState = {
  active: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends EntityStore<AuthState> {

  constructor() {
    super(initialState);
  }

}

