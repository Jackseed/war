import { Injectable } from '@angular/core';
import { PlayerStore, PlayerState } from './player.store';
import { SubcollectionService, CollectionConfig, CollectionService, pathWithParams } from 'akita-ng-fire';
import { GameQuery } from 'src/app/games/+state';
import { distinctUntilChanged, map, tap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players' })
export class PlayerService extends SubcollectionService<PlayerState> {

  constructor(
    store: PlayerStore,
    private gameQuery: GameQuery,
  ) {
    super(store);
  }

  get path(): Observable<string> {
    return this.gameQuery.selectActiveId().pipe(
      distinctUntilChanged(),
      map(gameId => pathWithParams(this.constructor['path'], {gameId})),
    );
  }

  get currentPath(): string {
    const id = this.gameQuery.getActiveId();
    return pathWithParams(this.constructor['path'], {id});
  }

}
