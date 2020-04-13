import { QueryEntity, QueryConfig, Order } from '@datorama/akita';
import { TileStore, TileState } from './tile.store';
import { Observable } from 'rxjs';
import { Tile } from '.';
import { map } from 'rxjs/operators';
import { UnitQuery } from '../../unit/+state';
import { Injectable } from '@angular/core';
import { boardCols } from 'src/app/games/+state';

@QueryConfig({
  sortBy: 'id',
  sortByOrder: Order.ASC
})
@Injectable({ providedIn: 'root' })
export class TileQuery extends QueryEntity<TileState> {

  constructor(
    protected store: TileStore,
    private unitQuery: UnitQuery,
  ) {
    super(store);
  }

  public get visibleTileIds$(): Observable<number[]> {
    return this.unitQuery.selectAll().pipe(
      map(units => {
        // gets the adjacent tiles visible by the unit
        const unitTileIdsArray: number[][] = units.map(
          unit => this.getAdjacentTiles(unit.tileId, unit.vision)
        );
        const visibleIds: number[] = [];
        // flatten the array of each unit into one, without duplicate
        for (const ids of unitTileIdsArray) {
          for (const id of ids) {
            if (!visibleIds.includes(id)) {
              visibleIds.push(id);
            }
          }
        }
        return visibleIds;
      })
    );
  }

  public getAdjacentTiles(tileId: number, paramValue: number): number[] {
    const tile: Tile = this.getEntity(tileId.toString());
    const tileIds: number[] = [];
    for (let x = -paramValue; x <= paramValue; x++) {
      for (let y = -paramValue; y <= paramValue; y++) {
        const X = tile.x + x;
        const Y = tile.y + y;
        // verifies that the tile is inside the board
        if ((X < boardCols) && (X >= 0) && (Y < boardCols) && (Y >= 0)) {
          const id = X + boardCols * Y;
          tileIds.push(id);
        }
      }
    }
    return tileIds;
  }

}
