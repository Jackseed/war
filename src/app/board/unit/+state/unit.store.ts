import { Injectable } from '@angular/core';
import { Unit } from './unit.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface UnitState extends CollectionState<Unit>, ActiveState<string> {}

const initialState = {
  active: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'unit' })
export class UnitStore extends EntityStore<UnitState> {

  constructor() {
    super(initialState);
  }

}

