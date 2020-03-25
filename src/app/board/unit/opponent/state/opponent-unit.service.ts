import { Injectable } from '@angular/core';
import { OpponentUnitStore, OpponentUnitState } from './opponent-unit.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'opponent-units' })
export class OpponentUnitService extends CollectionService<OpponentUnitState> {

  constructor(
    store: OpponentUnitStore
  ) {
    super(store);
  }

}
