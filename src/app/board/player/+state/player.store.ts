import { Injectable } from '@angular/core';
import { Player, PlayerUI } from './player.model';
import { ActiveState, EntityStore, StoreConfig, EntityUIStore, EntityState } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface PlayerState extends CollectionState<Player>, ActiveState<string> {}
export interface PlayerUIState extends EntityState<PlayerUI> {}

const initialState = {
  active: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'player' })
export class PlayerStore extends EntityStore<PlayerState> {
  ui: EntityUIStore<PlayerUIState>;

  constructor() {
    super(initialState);
    this.createUIStore().setInitialEntityState(entity => ({
      isOpponent: false,
    }));
  }

}

