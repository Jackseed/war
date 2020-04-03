import { Injectable } from '@angular/core';
import { Unit, UnitUI } from './unit.model';
import { EntityState, ActiveState, EntityStore, StoreConfig, EntityUIStore, guid } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface UnitState extends CollectionState<Unit>, ActiveState<string> {}
export interface UnitUIState extends EntityState<UnitUI> {}

const initialState = {
  active: null
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'unit' })
export class UnitStore extends EntityStore<UnitState> {
  ui: EntityUIStore<UnitUIState>;

  constructor() {
    super(initialState);
    this.createUIStore().setInitialEntityState(entity => ({
      isSelected: false,
    }));
  }

}

