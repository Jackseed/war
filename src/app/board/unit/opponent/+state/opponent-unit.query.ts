import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OpponentUnitStore, OpponentUnitState } from './opponent-unit.store';
import { Observable, combineLatest } from 'rxjs';
import { Unit } from '../../+state';
import { TileQuery } from 'src/app/board/tile/+state';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OpponentUnitQuery extends QueryEntity<OpponentUnitState> {

  constructor(
    protected store: OpponentUnitStore,
    private tileQuery: TileQuery,
    ) {
    super(store);
  }

  public get visibleUnits$(): Observable<Unit[]> {
    const visibleTileIds$ = this.tileQuery.visibleTileIds$;
    const units$ = this.selectAll();

    return combineLatest([visibleTileIds$, units$]).pipe(
      map(([visibleTileIds, units]) => {
        return units.filter(unit => visibleTileIds.includes(unit.tileId));
      })
    );
  }

}
