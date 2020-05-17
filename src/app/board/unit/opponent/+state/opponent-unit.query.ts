import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { OpponentUnitStore, OpponentUnitState } from "./opponent-unit.store";
import { Observable, combineLatest } from "rxjs";
import { UnitQuery } from "../../+state/unit.query";
import { Unit, createUnit } from "../../+state/unit.model";
import { TileQuery } from "src/app/board/tile/+state/tile.query";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class OpponentUnitQuery extends QueryEntity<OpponentUnitState> {
  unitTypes: ("soldier" | "musketeer" | "knight" | "cannon")[] = [
    "soldier",
    "musketeer",
    "knight",
    "cannon",
  ];

  constructor(
    protected store: OpponentUnitStore,
    private unitQuery: UnitQuery,
    private tileQuery: TileQuery
  ) {
    super(store);
  }

  public get visibleUnits$(): Observable<Unit[]> {
    const visibleTileIds$ = this.tileQuery.visibleTileIds$;
    const units$ = this.selectAll({
      filterBy: (unit) => unit.tileId !== null,
    });

    return combineLatest([visibleTileIds$, units$]).pipe(
      map(([visibleTileIds, units]) => {
        return units.filter((unit) => visibleTileIds.includes(unit.tileId));
      })
    );
  }

  public get visibleUnitTileIds$(): Observable<number[]> {
    return this.visibleUnits$.pipe(
      map((units) => units.map(({ tileId }) => tileId))
    );
  }

  public getUnitByTileId(tileId: number): Unit {
    const units = this.getAll({
      filterBy: (unit) => unit.tileId !== null,
    });
    return units.find((unit) => unit.tileId === tileId);
  }

  public get unitTileIds$(): Observable<number[]> {
    return this.selectAll({
      filterBy: (unit) => unit.tileId !== null,
    }).pipe(map((units) => units.map(({ tileId }) => tileId)));
  }

  public get unitTileIds(): number[] {
    return this.getAll({
      filterBy: (unit) => unit.tileId !== null,
    }).map((unit) => unit.tileId);
  }

  public get visibleUnitTileIds(): number[] {
    const activeUnits = this.unitQuery.getAll({
      filterBy: (unit) => unit.tileId !== null,
    });
    const visibleTileIds = this.tileQuery.visibleTileIds(activeUnits);
    const unitTileIds = this.unitTileIds;

    return unitTileIds.filter((id) => visibleTileIds.includes(id));
  }

  public get tiredUnits(): Unit[] {
    let tiredUnits: Unit[] = [];

    for (const unitType of this.unitTypes) {
      const baseUnit = createUnit(unitType);
      const tiredTypedUnits = this.getAll({
        filterBy: (unit) =>
          unit.type === unitType &&
          unit.tileId !== null &&
          unit.stamina < baseUnit.stamina,
      });
      tiredUnits = tiredUnits.concat(tiredTypedUnits);
    }

    return tiredUnits;
  }

  public deathCountByType$(
    unitType: "soldier" | "musketeer" | "knight" | "cannon"
  ): Observable<number> {
    return this.selectCount(
      (unit) => unit.type === unitType && unit.tileId === null
    );
  }
}
