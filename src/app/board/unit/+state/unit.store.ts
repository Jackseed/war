import { Injectable } from '@angular/core';
import { Unit, UnitUI } from './unit.model';
import { EntityState, ActiveState, EntityStore, StoreConfig, EntityUIStore } from '@datorama/akita';

export interface UnitState extends EntityState<Unit>, ActiveState<string> {}
export interface UnitUIState extends EntityState<UnitUI> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'unit' })
export class UnitStore extends EntityStore<UnitState> {
  ui: EntityUIStore<UnitUIState>;

  constructor() {
    super();
    this.createUIStore().setInitialEntityState(entity => ({
      isSelected: false,
    }));
  }

}

