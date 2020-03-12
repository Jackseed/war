import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Tile } from './tile.model';

export interface TileState extends EntityState<Tile> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tiles' })
export class TileStore extends EntityStore<TileState, Tile> {

  constructor() {
    super();
  }

}

