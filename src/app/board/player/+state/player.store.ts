import { Injectable } from '@angular/core';
import { Player } from './player.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface PlayerState extends CollectionState<Player>, ActiveState<string> {}

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

