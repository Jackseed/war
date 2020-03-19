import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AuthStore, AuthState } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends QueryEntity<AuthState> {
  public user$ = this.select(state => state.profile);

  constructor(protected store: AuthStore) {
    super(store);
  }
  get user() {
    return this.getValue().profile;
  }
  get userId() {
    return this.getValue().uid;
  }
}
