import { Injectable } from '@angular/core';
import { CollectionGuard } from 'akita-ng-fire';
import { PlayerService, PlayerState, PlayerStore } from '../+state';
import { tap, switchMap } from 'rxjs/operators';
import { GameQuery } from 'src/app/games/+state';
import { AuthQuery } from 'src/app/auth/+state';

@Injectable({providedIn: 'root'})
export class PlayerGuard extends CollectionGuard<PlayerState> {

  constructor(
    service: PlayerService,
    private authQuery: AuthQuery,
    private store: PlayerStore,
    private gameQuery: GameQuery,
  ) {
    super(service);
  }

  sync() {
    return this.gameQuery.selectActiveId().pipe(
      tap(_ => this.store.reset()),
      tap(_ => this.store.setActive(this.authQuery.getActiveId())),
      switchMap(gameId => this.service.syncCollection({ params: { gameId }}))
    );
  }
}
