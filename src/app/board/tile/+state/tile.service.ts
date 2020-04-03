import { Injectable } from '@angular/core';
import { Unit, UnitStore, UnitService } from '../../unit/+state';
import { TileQuery } from './tile.query';
import { TileStore, TileState } from './tile.store';
import { Tile, createTile } from './tile.model';
import { GameQuery, boardCols, boardMaxTiles } from 'src/app/games/+state';
import { PlayerQuery } from '../../player/+state';
import { CollectionService, CollectionConfig, pathWithParams } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/tiles' })
export class TileService extends CollectionService<TileState> {

  constructor(
    store: TileStore,
    private query: TileQuery,
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
    private unitStore: UnitStore,
    private unitService: UnitService,
  ) {
    super(store);
  }

  get path(): string {
    const path = 'path';
    const gameId = this.gameQuery.getActiveId();
    return pathWithParams(this.constructor[path], {gameId});
  }

  setTiles() {
    const tiles: Tile[] = [];
    this.store.reset();
    for (let i = 0; i < boardCols; i++) {
      for (let j = 0; j < boardCols; j++) {
        const tileId = j + boardCols * i;
        if ( tileId < boardMaxTiles) {
          const tile: Tile = createTile(tileId, j, i);
          tiles.push(tile);
        }
      }
    }
    this.setDBTiles(tiles);
  }

  setDBTiles(tiles: Tile[]) {
    const collection = this.db.firestore.collection(this.currentPath);
    const batch = this.db.firestore.batch();

    for (const tile of tiles) {
      const ref = collection.doc(tile.id.toString());
      batch.set(ref, tile);
    }
    batch.commit();
  }

  markTileWithUnit(unit: Unit) {
    // checks if the unit belongs to the active player and add visibility then
    if (unit.playerId === this.playerQuery.getActiveId()) {
      console.log(unit);
      this.store.update(unit.tileId.toString(), { unit });
      this.switchAdjacentTilesParameter(unit.tileId, 'visibility', unit.vision);
    // if the unit is enemy, marks it opponent
    } else {
      this.store.update(unit.tileId.toString(), {
        unit: {
          ...unit,
          isOpponent: true,
        }
      });
    }
  }

  public moveSelectedUnit(unit: Unit, tileId: number) {
    this.removeSelected();
    this.removeUnitfromTile(unit.tileId);
    this.unitService.updatePosition(unit, tileId);
  }

  public removeSelected() {
    this.store.ui.update(null, {
      isSelected: false,
      isReachable: false,
    });
  }

  public removeUnitfromTile(tileId: number) {
    this.store.update(tileId.toString(), {unit: null});
  }

  markAsVisible(tileId: number) {
    this.store.ui.update(tileId, ({ isVisible: true }));
  }

  markAsReachable(tileId: number) {
    this.store.ui.update(tileId, ({ isReachable: true }));
  }

  markAsSelected(tileId: number, unit: Unit) {
    this.store.ui.update(tileId, tile => ({ isSelected: true }));
    this.switchAdjacentTilesParameter(tileId, 'reachable', unit.move);
    this.unitStore.setActive(unit.id.toString());
  }

  switchAdjacentTilesParameter(tileId: number, paramType: 'visibility' | 'reachable', paramValue: number) {
    const tile: Tile = this.query.getEntity(tileId.toString());
    console.log(this.query.getAll());
    console.log(tileId, tile);
    for (let x = -paramValue; x <= paramValue; x++) {
      for (let y = -paramValue; y <= paramValue; y++) {
        const X = tile.x + x;
        const Y = tile.y + y;
        // verifies that the tile is inside the board
        if ((X < boardCols) && (X >= 0) && (Y < boardCols) && (Y >= 0)) {
          const id = X + boardCols * Y;
          if (paramType === 'visibility') {
            this.markAsVisible(id);
          }
          if (paramType === 'reachable') {
            if (id !== tile.id) {
              this.markAsReachable(id);
            }
          }
        }
      }
    }
  }

}
