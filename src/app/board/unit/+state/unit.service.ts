import { Injectable } from '@angular/core';
import { UnitStore, UnitState } from './unit.store';
import { createUnit, Unit } from './unit.model';
import { GameQuery, boardCols } from 'src/app/games/+state';
import { PlayerQuery } from '../../player/+state';
import { CollectionConfig, pathWithParams, CollectionService } from 'akita-ng-fire';
import { UnitQuery } from './unit.query';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players/:playerId/units' })
export class UnitService extends CollectionService<UnitState> {
  unitTypes = ['soldier', 'musketeer', 'knight', 'canon'];

  constructor(
    store: UnitStore,
    private query: UnitQuery,
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
  ) {
    super(store);
  }

  get path(): string {
    const path = 'path';
    const gameId = this.gameQuery.getActiveId();
    const playerId = this.playerQuery.getActiveId();
    return pathWithParams(this.constructor[path], {gameId, playerId});
  }

  public setUnits() {
    const units = this.defaultPositionUnits;
    const collection = this.db.firestore.collection(this.currentPath);
    const batch = this.db.firestore.batch();

    this.store.reset();

    for (const unit of units) {
      const ref = collection.doc(unit.id);
      batch.set(ref, unit);
    }
    batch.commit();
  }

  get defaultPositionUnits(): Unit[] {
    const player = this.playerQuery.getActive();
    const units: Unit[] = [];
    let i = 0;
    let x = 1;
    if (player.color === 'black') {
      i = 9;
      x = -1;
    }
    for (const unitType of this.unitTypes) {
      const typedUnits = this.query.getAll({
        filterBy: unit => unit.type === unitType
      });
      for (let unit of typedUnits) {
        unit = {
          ...unit,
          tileId: i
        };
        units.push(unit);
        if (i < (boardCols * boardCols - boardCols)) {
          i = i + boardCols;
        } else {
          i = i % boardCols + 1 * x;
        }
      }
    }
    return units;
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
