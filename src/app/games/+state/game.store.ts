import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Game } from './game.model';

export interface GameState extends EntityState<Game> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'games' })
export class GameStore extends EntityStore<GameState, Game> {

  constructor() {
    super();
  }

}

