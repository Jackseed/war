import { Injectable } from '@angular/core';
import { Player } from './player.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';

export interface PlayerState extends EntityState<Player>, ActiveState<string> {}

const initialState = {
  active: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'player' })
export class PlayerStore extends EntityStore<PlayerState> {

  constructor() {
    super(initialState);
  }

}

