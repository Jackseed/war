import { Injectable } from '@angular/core';
import { QueryEntity, EntityUIQuery } from '@datorama/akita';
import { UnitStore, UnitState, UnitUIState } from './unit.store';

@Injectable({ providedIn: 'root' })
export class UnitQuery extends QueryEntity<UnitState> {
  ui: EntityUIQuery<UnitUIState>;

  constructor(protected store: UnitStore) {
    super(store);
  }

}
