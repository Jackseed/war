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

  get path(): string {
    const gameId: string = this.gameQuery.getActiveId();
    const opponentId: string = this.playerQuery.opponentId;
    const path = 'path';
    return pathWithParams(this.constructor[path], {gameId, opponentId});
  }

}
