import { Injectable } from '@angular/core';
import { TileStore, TileState } from './tile.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'tiles' })
export class TileService extends CollectionService<TileState> {

  constructor(store: TileStore) {
    super(store);
  }

}
