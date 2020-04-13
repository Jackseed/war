import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OpponentUnitStore, OpponentUnitState } from './opponent-unit.store';
import { Observable, combineLatest } from 'rxjs';
import { Unit } from '../../+state';
import { TileQuery } from 'src/app/board/tile/+state';
import { map, switchMap } from 'rxjs/operators';

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
    visibleTileIds$.subscribe(console.log);
    units$.subscribe(console.log);

    return combineLatest([visibleTileIds$, units$]).pipe(
      map(([visibleTileIds, units]) => {
        return units.filter(unit => visibleTileIds.includes(unit.tileId));
      })
    );
  }

  public get visibleUnitTileIds$(): Observable<number[]> {
    return this.visibleUnits$.pipe(
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
