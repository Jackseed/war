import { Injectable } from '@angular/core';
import { QueryEntity, QueryConfig, Order } from '@datorama/akita';
import { TileStore, TileState } from './tile.store';

@QueryConfig({
  sortBy: 'id',
  sortByOrder: Order.ASC
})
@Injectable({ providedIn: 'root' })
export class TileQuery extends QueryEntity<TileState> {

  constructor(protected store: TileStore) {
    super(store);
  }

}
