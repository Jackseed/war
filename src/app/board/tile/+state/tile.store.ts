import { Tile } from './tile.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface TileState extends EntityState<Tile>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tile'})
export class TileStore extends EntityStore<TileState> {
  constructor() {
    super();
  }
}

