import { Injectable } from '@angular/core';
import { Tile, TileUI } from './tile.model';
import { EntityState, ActiveState, EntityStore, StoreConfig, EntityUIStore } from '@datorama/akita';

export interface TileState extends EntityState<Tile>, ActiveState<string> {}
export interface TileUIState extends EntityState<TileUI> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tile' })
export class TileStore extends EntityStore<TileState> {
  ui: EntityUIStore<TileUIState>;

  constructor() {
    super();
    this.createUIStore().setInitialEntityState(entity => ({
      isVisible: false,
      isReachable: false,
    }));
  }

}

