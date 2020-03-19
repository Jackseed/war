import { Injectable } from '@angular/core';
import { Unit } from './unit.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';

export interface UnitState extends EntityState<Unit, string>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'unit' })
export class UnitStore extends EntityStore<UnitState> {

  constructor() {
    super();
  }

}

