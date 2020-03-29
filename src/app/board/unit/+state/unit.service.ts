import { Injectable } from '@angular/core';
import { UnitStore, UnitState } from './unit.store';
import { createUnit, Unit } from './unit.model';
import { GameQuery } from 'src/app/games/+state';
import { PlayerQuery } from '../../player/+state';
import { CollectionConfig, pathWithParams, SubcollectionService } from 'akita-ng-fire';
import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players/:playerId/units' })
export class UnitService extends SubcollectionService<UnitState> {

  constructor(
    store: UnitStore,
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
  ) {
    super(store);
  }

  get path(): Observable<string> {
    const gameId$ = this.gameQuery.selectActiveId();
    const playerId$ = this.playerQuery.selectActiveId();
    const path = 'path';
    return combineLatest([gameId$, playerId$]).pipe(
      map(([gameId, playerId]) => pathWithParams(this.constructor[path], {gameId, playerId}))
    );
  }

  get currentPath(): string {
    const path = 'path';
    const gameId = this.gameQuery.getActiveId();
    const playerId = this.playerQuery.getActiveId();
    return pathWithParams(this.constructor[path], {gameId, playerId});
  }

  public createUnits() {
    const id = this.db.createId();
    const playerId: string = this.playerQuery.getActiveId();
    const soldier = createUnit(id, playerId, 'soldier');
    this.db.collection(this.currentPath).doc(id).set(soldier);
  }

  public addUnit(unitType, tileId: number) {
    const id = this.db.createId();
    const playerId: string = this.playerQuery.getActiveId();
    this.store.add(createUnit(id, playerId, unitType, tileId));
  }

  public removeUnit(unit: Unit) {
    this.store.remove(unit.id);
  }

  public updatePosition(unit: Unit, tileId: number) {
    this.db.collection(this.currentPath).doc(unit.id.toString()).set({
      ...unit,
      tileId
    });
  }

}
