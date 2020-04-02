import { Injectable } from '@angular/core';
import { CollectionGuard } from 'akita-ng-fire';
import { UnitState, UnitService, UnitStore } from '../+state';
import { GameQuery } from 'src/app/games/+state';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
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
      switchMap(gameId => this.service.syncCollection({ params: { gameId }}))
    );
  }

}
