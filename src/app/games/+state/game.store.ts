import { Injectable } from '@angular/core';
import { Game } from './game.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';

export interface GameState extends EntityState<Game, string>, ActiveState<string> {}

const initialState = {
  active: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'game' })
export class GameStore extends EntityStore<GameState> {

  constructor() {
    super(initialState);
  }

}

