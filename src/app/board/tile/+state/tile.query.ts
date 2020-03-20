import { Injectable } from '@angular/core';
import { QueryEntity, QueryConfig, Order, EntityUIQuery } from '@datorama/akita';
import { TileStore, TileState, TileUIState } from './tile.store';

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

}
