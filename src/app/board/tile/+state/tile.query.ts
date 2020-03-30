import { Injectable } from '@angular/core';
import { QueryEntity, QueryConfig, Order, EntityUIQuery } from '@datorama/akita';
import { TileStore, TileState, TileUIState } from './tile.store';
import { Observable, combineLatest } from 'rxjs';
import { Tile, TileUI } from '.';
import { map, switchMap } from 'rxjs/operators';
import { Unit } from '../../unit/+state';

@QueryConfig({
  sortBy: 'id',
  sortByOrder: Order.ASC
})
@Injectable({ providedIn: 'root' })
export class TileQuery extends QueryEntity<TileState> {
  ui: EntityUIQuery<TileUIState>;

  constructor(
    protected store: TileStore,
  ) {
    super(store);
    this.createUIQuery();
  }

  public combineTileWithUIandUnits(tiles$: Observable<Tile[]>, units$: Observable<Unit[]>, isOpponent: boolean)
  : Observable<(Tile & TileUI)[]> {
    const tilesUI$ = tiles$.pipe(
      map(tiles =>
        tiles.map(({id}) => id.toString())),
      switchMap(tileIds => this.ui.selectMany(tileIds))
    );

    return combineLatest([tiles$, tilesUI$, units$]).pipe(
      map(([tiles, tilesUI, units]) => {
      tiles = tiles.map(tile => {
        return {
          ...tile,
          ...tilesUI[tile.id]
        };
      });
      console.log(tilesUI);
      units.map(unit => {
        tiles[unit.tileId] = {
          ...tiles[unit.tileId],
          unit: {
            ...unit,
            isOpponent,
          }
        };
      });
      console.log(tiles);
      return tiles;
    }));
  }

  public get visibleTiles$(): Observable<Tile[]> {
    return this.ui.selectAll({
      filterBy: tile => tile.isVisible === true
    });
  }

}
