import { Injectable } from '@angular/core';
import { PlayerStore, PlayerState } from './player.store';
import { CollectionService, CollectionConfig, pathWithParams } from 'akita-ng-fire';
import { GameQuery } from 'src/app/games/+state';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players' })
export class PlayerService extends CollectionService<PlayerState> {

  constructor(
    store: PlayerStore,
    private gameQuery: GameQuery,
  ) {
    super(store);
  }

  get path(): string {
    const path = 'path';
    const gameId = this.gameQuery.getActiveId();
    return pathWithParams(this.constructor[path], {gameId});
  }

}
