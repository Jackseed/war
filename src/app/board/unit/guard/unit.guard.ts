import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { UnitState, UnitService, UnitStore } from '../+state';
import { GameQuery } from 'src/app/games/+state';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
@CollectionGuardConfig({ awaitSync: true })
export class UnitGuard extends CollectionGuard<UnitState> {

  constructor(
    service: UnitService,
    private store: UnitStore,
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
