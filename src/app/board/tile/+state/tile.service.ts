import { Injectable } from '@angular/core';
import { Unit, UnitStore, UnitService } from '../../unit/+state';
import { TileQuery } from './tile.query';
import { TileStore } from './tile.store';
import { Tile, createTile } from './tile.model';
import { boardCols, boardMaxTiles } from 'src/app/games/+state';

@Injectable({ providedIn: 'root' })
export class TileService {

  constructor(
    private store: TileStore,
    private query: TileQuery,
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

  markAsSelected(tileId: number, unit: Unit) {
    this.store.update(tileId, ({ isSelected: true }));
    this.markAdjacentTilesReachable(unit);
    this.unitStore.setActive(unit.id.toString());
  }

  markAdjacentTilesReachable(unit: Unit) {
    let reachableTileIds = this.query.getAdjacentTiles(unit.tileId, unit.move);
    // remove the tile id of the unit
    reachableTileIds = reachableTileIds.filter(tileId => tileId !== unit.tileId);
    this.store.update(reachableTileIds, ({ isReachable: true }));
  }

  public moveSelectedUnit(unit: Unit, tileId: number) {
    this.removeSelected();
    this.unitService.updatePosition(unit, tileId);
  }

  public removeSelected() {
    this.store.update(null, {
      isSelected: false,
      isReachable: false,
    });
  }

}
