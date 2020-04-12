import { Injectable } from '@angular/core';
import { Unit, UnitStore, UnitService } from '../../unit/+state';
import { TileQuery } from './tile.query';
import { TileStore } from './tile.store';
import { Tile, createTile } from './tile.model';
import { boardCols, boardMaxTiles } from 'src/app/games/+state';
import { PlayerQuery } from '../../player/+state';

@Injectable({ providedIn: 'root' })
export class TileService {

  constructor(
    private store: TileStore,
    private query: TileQuery,
    private playerQuery: PlayerQuery,
    private unitStore: UnitStore,
    private unitService: UnitService,
  ) {}

  setTiles() {
    const tiles: Tile[] = [];
    for (let i = 0; i < boardCols; i++) {
      for (let j = 0; j < boardCols; j++) {
        const tileId = j + boardCols * i;
        if ( tileId < boardMaxTiles) {
          const tile = createTile(tileId, j, i);
          tiles.push(tile);
        }
      }
    }
    this.store.set(tiles);
  }

  markTileWithUnit(unit: Unit) {
    // checks if the unit belongs to the active player and the unit to the tile and add visibility to adjacent ones
    if (unit.playerId === this.playerQuery.getActiveId()) {
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
    this.switchAdjacentTilesParameter(unit.tileId, 'invisibility', unit.vision);
    this.unitService.updatePosition(unit, tileId);
  }

  public removeSelected() {
    this.store.update(null, {
      isSelected: false,
      isReachable: false,
    });
  }

  public removeUnitfromTile(tileId: number) {
    this.store.update(tileId.toString(), {unit: null});
  }

  markAsVisible(tileId: number) {
    this.store.update(tileId, ({ isVisible: true }));
  }

  markInvisible(tileId: number) {
    this.store.update(tileId, ({ isVisible: false }));
  }

  markAsReachable(tileId: number) {
    this.store.update(tileId, ({ isReachable: true }));
  }

  markAsSelected(tileId: number, unit: Unit) {
    this.store.update(tileId, tile => ({ isSelected: true }));
    this.switchAdjacentTilesParameter(tileId, 'reachable', unit.move);
    this.unitStore.setActive(unit.id.toString());
  }

  switchAdjacentTilesParameter(tileId: number, paramType: 'visibility' |'invisibility' | 'reachable', paramValue: number) {
    const tile: Tile = this.query.getEntity(tileId.toString());
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
          if (paramType === 'invisibility') {
            this.markInvisible(id);
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
