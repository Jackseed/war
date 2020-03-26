import { Injectable } from '@angular/core';
import { OpponentUnitStore, OpponentUnitState } from './opponent-unit.store';
import { CollectionConfig, CollectionService, pathWithParams } from 'akita-ng-fire';
import { Observable, combineLatest } from 'rxjs';
import { GameQuery } from 'src/app/games/+state';
import { PlayerQuery, Player } from 'src/app/board/player/+state';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players/:opponentId/units' })
export class OpponentUnitService extends CollectionService<OpponentUnitState> {

  constructor(
    store: OpponentUnitStore,
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
  ) {
    super(store);
  }

  get path(): Observable<string> {
    const gameId$: Observable<string> = this.gameQuery.selectActiveId();
    const opponentId$: Observable<string> = this.playerQuery.opponentId$;
    const path = 'path';
    return combineLatest([gameId$, opponentId$]).pipe(
      map(([gameId, opponentId]) => pathWithParams(this.constructor[path], {gameId, opponentId}))
    );
  }

}
