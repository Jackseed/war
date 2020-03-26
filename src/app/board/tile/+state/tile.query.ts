import { Injectable } from '@angular/core';
import { QueryEntity, QueryConfig, Order, EntityUIQuery, ID } from '@datorama/akita';
import { TileStore, TileState, TileUIState } from './tile.store';
import { Observable, combineLatest } from 'rxjs';
import { Tile, TileUI } from '.';
import { map } from 'rxjs/operators';
import { OpponentUnitQuery } from '../../unit/opponent/+state';

@QueryConfig({
  sortBy: 'id',
  sortByOrder: Order.ASC
})
@Injectable({ providedIn: 'root' })
export class TileQuery extends QueryEntity<TileState> {
  ui: EntityUIQuery<TileUIState>;

  constructor(
    protected store: TileStore,
    private opponentUnitQuery: OpponentUnitQuery,
  ) {
    super(store);
    this.createUIQuery();
  }

  public selectTileWithUIandOpponentUnits(): Observable<(Tile & TileUI)[]> {
    const tiles$ = this.selectAll();
    const tilesUI$ = this.ui.selectAll();
    const opponentUnits$ = this.opponentUnitQuery.selectAll();

    return combineLatest([tiles$, tilesUI$, opponentUnits$]).pipe(
      map(([tiles, tilesUI, opponentUnits]) => {
      tiles = tiles.map(tile => {
        return {
          ...tile,
          ...tilesUI[tile.id]
        };
      });
      opponentUnits.map(unit => {
        tiles[unit.tileId] = {
          ...tiles[unit.tileId],
          unit: {
            ...unit,
            isOpponent: true,
          }
        };
      });
      console.log(tiles);
      return tiles;
    }));
  }

  public get visibleTiles$(): Observable<Tile[]> {
    return this.ui.selectAll({
      filterBy: entity => entity.isVisible === true
    });
  }

}
