import { Injectable } from '@angular/core';
import { PlayerStore, PlayerState } from './player.store';
import { SubcollectionService, CollectionConfig, pathWithParams } from 'akita-ng-fire';
import { GameQuery } from 'src/app/games/+state';
import { distinctUntilChanged, map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PlayerQuery } from './player.query';
import { Player } from './player.model';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players' })
export class PlayerService extends SubcollectionService<PlayerState> {

  constructor(
    store: PlayerStore,
    private query: PlayerQuery,
    private gameQuery: GameQuery,
  ) {
    super(store);
  }

  get path(): Observable<string> {
    const path = 'path';
    return this.gameQuery.selectActiveId().pipe(
      distinctUntilChanged(),
      map(gameId => pathWithParams(this.constructor[path], {gameId})),
    );
  }

  get currentPath(): string {
    const path = 'path';
    const id = this.gameQuery.getActiveId();
    return pathWithParams(this.constructor[path], {id});
  }

}
