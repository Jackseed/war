import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OpponentUnitStore, OpponentUnitState } from './opponent-unit.store';
import { Observable, combineLatest } from 'rxjs';
import { Unit, UnitQuery } from '../../+state';
import { TileQuery } from 'src/app/board/tile/+state';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OpponentUnitQuery extends QueryEntity<OpponentUnitState> {

  constructor(
    protected store: OpponentUnitStore,
    private unitQuery: UnitQuery,
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

  public get visibleUnitTileIds$(): Observable<number[]> {
    return this.visibleUnits$.pipe(
      map(units =>
        units.map(({tileId}) => tileId)
      )
    );
  }

  public getUnitByTileId(tileId: number): Unit {
    const units = this.getAll();
    return units.find(unit => unit.tileId === tileId);
  }

  public get unitTileIds$(): Observable<number[]> {
    return this.selectAll().pipe(
      map(units =>
        units.map(({tileId}) => tileId)
      )
    );
  }

  public get unitTileIds(): number[] {
    return this.getAll().map(unit => unit.tileId);
  }

  public get visibleUnitTileIds(): number[] {
    const activeUnits = this.unitQuery.getAll();
    const visibleTileIds = this.tileQuery.visibleTileIds(activeUnits);
    const unitTileIds = this.unitTileIds;

    return unitTileIds.filter(id => visibleTileIds.includes(id));
  }
}
