import { QueryEntity, QueryConfig, Order } from '@datorama/akita';
import { TileStore, TileState } from './tile.store';
import { Observable } from 'rxjs';
import { Tile } from '.';
import { map } from 'rxjs/operators';
import { UnitQuery } from '../../unit/+state';
import { Injectable } from '@angular/core';
import { boardCols, boardMaxTiles } from 'src/app/games/+state';

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

  public get visibleTiles$(): Observable<Tile[]> {
    return this.selectAll({
      filterBy: tile => tile.isVisible === true
    });
  }
  public get visibleTileIds2$(): Observable<number[]> {
    return this.unitQuery.selectAll().pipe(
      map(units => {
        const idsArray: number[][] = units.map(unit => this.getAdjacentTiles(unit.tileId, unit.vision));
        const visibleIds: number[] = [];
        for (const ids of idsArray) {
          visibleIds.concat(ids);
        }
        return visibleIds;
      })
    );
  }

  public get visibleTileIds$(): Observable<number[]> {
    return this.visibleTiles$.pipe(
      map(visibleTiles =>
        visibleTiles.map(({id}) => id))
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
