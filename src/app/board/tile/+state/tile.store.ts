import { Injectable } from '@angular/core';
import { Tile } from './tile.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';

export interface TileState extends EntityState<Tile, string>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tile' })
export class TileStore extends EntityStore<TileState> {

  constructor() {
    super();
  }

}

