import { Injectable } from '@angular/core';
import { TileState, TileService, TileStore } from '../+state';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { switchMap, tap } from 'rxjs/operators';
import { GameQuery } from 'src/app/games/+state';

@Injectable({providedIn: 'root'})
@CollectionGuardConfig({ awaitSync: true })
export class TileGuard extends CollectionGuard<TileState> {

  constructor(
    service: TileService,
    private store: TileStore,
    private gameQuery: GameQuery,
  ) {
    super(service);
  }

  sync() {
    return this.gameQuery.selectActiveId().pipe(
      tap(_ => this.store.reset()),
      tap(_ => this.store.ui.reset()),
      switchMap(gameId => this.service.syncCollection({ params: { gameId }}))
    );
  }

}
