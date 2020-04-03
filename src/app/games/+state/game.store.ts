import { Injectable } from '@angular/core';
import { Game } from './game.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface GameState extends CollectionState<Game>, ActiveState<string> {}

const initialState = {
  active: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'game', idKey: 'id' })
export class GameStore extends EntityStore<GameState> {
  public boardSize = 3;

  constructor() {
    super(initialState);
  }

}

