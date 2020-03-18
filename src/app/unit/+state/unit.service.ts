import { Injectable } from '@angular/core';
import { UnitStore, UnitState } from './unit.store';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'units' })
export class UnitService extends CollectionService<UnitState> {

  constructor(store: UnitStore) {
    super(store);
  }

}
