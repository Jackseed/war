import { Injectable } from '@angular/core';
import { QueryEntity, EntityUIQuery } from '@datorama/akita';
import { UnitStore, UnitState, UnitUIState } from './unit.store';
import { Observable } from 'rxjs';
import { Unit } from './unit.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UnitQuery extends QueryEntity<UnitState> {
  ui: EntityUIQuery<UnitUIState>;

  constructor(
    protected store: UnitStore,
  ) {
    super(store);
  }

  public unitsByType$(unitType: 'soldier' | 'musketeer' | 'knight' | 'cannon'): Observable<Unit[]> {
    return this.selectAll({
      filterBy: unit => unit.type === unitType
    });
  }

  public get unitTileIds$(): Observable<number[]> {
    return this.selectAll().pipe(
      map(units =>
        units.map(({tileId}) => tileId)
      )
    );
  }

  public getUnitbyTileId(tileId: number): Unit {
    const units = this.getAll();
    return units.find(unit => unit.tileId === tileId);
  }

}
