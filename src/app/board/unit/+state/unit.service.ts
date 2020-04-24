import { Injectable } from '@angular/core';
import { UnitStore, UnitState } from './unit.store';
import { createUnit, Unit } from './unit.model';
import { GameQuery, boardCols, unitPlacementMargin, xCastle, yCastle } from 'src/app/games/+state';
import { PlayerQuery } from '../../player/+state';
import { CollectionConfig, pathWithParams, CollectionService } from 'akita-ng-fire';
import { UnitQuery } from './unit.query';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players/:playerId/units' })
export class UnitService extends CollectionService<UnitState> {
  unitTypes = ['soldier', 'musketeer', 'knight', 'cannon'];

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

    for (const unit of units) {
      const ref = collection.doc(unit.id);
      batch.set(ref, unit);
    }

    batch.commit();

  }

  get defaultPositionUnits(): Unit[] {
    const player = this.playerQuery.getActive();
    const units: Unit[] = [];
    let y = unitPlacementMargin;
    let x = unitPlacementMargin;
    let i = 1;
    if (player.color === 'black') {
      x = boardCols - (unitPlacementMargin + 1);
    }
    for (const unitType of this.unitTypes) {
      const typedUnits = this.query.getAll({
        filterBy: unit => unit.type === unitType
      });
      for (let unit of typedUnits) {
        // avoid the castle
        if (x === xCastle && y === yCastle) {
          y++;
        }
        // give unit coordinates and push
        unit = {
          ...unit,
          tileId: x + y * boardCols,
        };
        units.push(unit);

        // increment y
        if (y < (boardCols - (unitPlacementMargin + 1))) {
          y++;
        // respect the margin and start a new line
        } else {
          if (player.color === 'black') {
            x = boardCols - (unitPlacementMargin + 1) + i;
          } else {
            x = unitPlacementMargin - i;
          }
          y = unitPlacementMargin;
          i++;
        }
      }
    }
    return units;
  }

  public addUnit(unitType, tileId: number) {
    const id = this.db.createId();
    const player = this.playerQuery.getActive();
    this.store.add(createUnit(id, player.id, player.color, unitType, tileId));
  }

  public removeUnit(unit: Unit) {
    this.store.remove(unit.id);
  }

  public updatePosition(unit: Unit, tileId: number) {
    this.db.collection(this.currentPath)
      .doc(unit.id.toString()).update({tileId});
  }

  public swapUnitPositions(tileId: number) {
    const clickedUnit = this.query.getUnitByTileId(tileId);
    const activeUnit = this.query.getActive();
    const collection = this.db.firestore.collection(this.currentPath);
    const batch = this.db.firestore.batch();

    batch.update(collection.doc(clickedUnit.id), {tileId: activeUnit.tileId});
    batch.update(collection.doc(activeUnit.id), {tileId: clickedUnit.tileId});

    batch.commit();
  }
}
