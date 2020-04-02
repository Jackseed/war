import { Injectable } from '@angular/core';
import { TileState, TileService, TileStore } from '../+state';
import { CollectionGuard } from 'akita-ng-fire';
import { switchMap, tap } from 'rxjs/operators';
import { GameQuery } from 'src/app/games/+state';

@Injectable({providedIn: 'root'})
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
      switchMap(gameId => this.service.syncCollection({ params: { gameId }}))
    );
  }

}
