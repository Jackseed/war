import { Injectable } from '@angular/core';
import { Unit, UnitStore, UnitService } from '../../unit/+state';
import { TileQuery } from './tile.query';
import { TileStore, TileState } from './tile.store';
import { Tile } from './tile.model';
import { GameService, GameQuery } from 'src/app/games/+state';
import { PlayerQuery } from '../../player/+state';
import { SubcollectionService, CollectionConfig, pathWithParams } from 'akita-ng-fire';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/tiles' })
export class TileService extends SubcollectionService<TileState> {
  boardSize: number = this.gameService.boardSize;

  constructor(
    store: TileStore,
    private query: TileQuery,
    private gameQuery: GameQuery,
    private gameService: GameService,
    private playerQuery: PlayerQuery,
    private unitStore: UnitStore,
    private unitService: UnitService,
  ) {
    super(store);
  }

  get path(): Observable<string> {
    const path = 'path';
    return this.gameQuery.selectActiveId().pipe(
      distinctUntilChanged(),
      map(gameId => pathWithParams(this.constructor[path], {gameId})),
    );
  }

  markTileWithUnit(unit: Unit) {
    // checks if the unit belongs to the active player and add visibility then
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
    console.log(tile);
    for (let x = -paramValue; x <= paramValue; x++) {
      for (let y = -paramValue; y <= paramValue; y++) {
        const X = tile.x + x;
        const Y = tile.y + y;
        // verifies that the tile is inside the board
        if ((X < this.boardSize) && (X >= 0) && (Y < this.boardSize) && (Y >= 0)) {
          const id = X + this.boardSize * Y;
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
