import { QueryEntity, QueryConfig, Order } from '@datorama/akita';
import { TileStore, TileState } from './tile.store';
import { Observable, combineLatest } from 'rxjs';
import { Tile } from '.';
import { map } from 'rxjs/operators';
import { Unit } from '../../unit/+state';
import { Injectable } from '@angular/core';

@QueryConfig({
  sortBy: 'id',
  sortByOrder: Order.ASC
})
@Injectable({ providedIn: 'root' })
export class TileQuery extends QueryEntity<TileState> {

  constructor(
    protected store: TileStore,
  ) {
    super(store);
  }

  public combineTileWithUnits(tiles$: Observable<Tile[]>, units$: Observable<Unit[]>, isOpponent: boolean)
  : Observable<(Tile)[]> {

  return combineLatest([tiles$, units$]).pipe(
    map(([tiles, units]) => {
      units.map(unit => {
        tiles[unit.tileId] = {
          ...tiles[unit.tileId],
          unit: {
            ...unit,
            isOpponent,
          }
        };
      });
      return tiles;
    }));

  }

  public get visibleTiles$(): Observable<Tile[]> {
    return this.selectAll({
      filterBy: tile => tile.isVisible === true
    });
  }

  public get visibleTileIds$(): Observable<number[]> {
    return this.visibleTiles$.pipe(
      map(visibleTiles =>
        visibleTiles.map(({id}) => id))
    );
  }

}
