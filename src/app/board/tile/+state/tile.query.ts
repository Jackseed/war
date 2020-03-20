import { Injectable } from '@angular/core';
import { QueryEntity, QueryConfig, Order, EntityUIQuery, ID } from '@datorama/akita';
import { TileStore, TileState, TileUIState } from './tile.store';
import { Observable, combineLatest } from 'rxjs';
import { Tile, TileUI } from '.';
import { map } from 'rxjs/operators';

@QueryConfig({
  sortBy: 'id',
  sortByOrder: Order.ASC
})
@Injectable({ providedIn: 'root' })
export class TileQuery extends QueryEntity<TileState> {
  ui: EntityUIQuery<TileUIState>;

  constructor(protected store: TileStore) {
    super(store);
    this.createUIQuery();
  }

  selectTileWithUI(): Observable<(Tile & TileUI)[]> {
    const tiles = this.selectAll();
    const tilesUI = this.ui.selectAll({ asObject: true });

    return combineLatest([tiles, tilesUI]).pipe(
      map(([ts, tsUI]) => {
      return ts.map(tile => {
        return {
          ...tile,
          ...tsUI[tile.id]
        };
      });
    }));
  }

}
