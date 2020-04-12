import { Injectable } from '@angular/core';
import { QueryEntity, EntityUIQuery } from '@datorama/akita';
import { UnitStore, UnitState, UnitUIState } from './unit.store';
import { Observable } from 'rxjs';
import { Unit } from './unit.model';

@Injectable({ providedIn: 'root' })
export class UnitQuery extends QueryEntity<UnitState> {
  ui: EntityUIQuery<UnitUIState>;

  constructor(
    protected store: UnitStore,
  ) {
    super(store);
  }

  public unitsByType(unitType: 'soldier' | 'musketeer' | 'knight' | 'cannon'): Observable<Unit[]> {
    return this.selectAll({
      filterBy: unit => unit.type === unitType
    });
  }
}
