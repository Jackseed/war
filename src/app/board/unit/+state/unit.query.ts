import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { UnitStore, UnitState } from "./unit.store";
import { Observable } from "rxjs";
import { Unit } from "./unit.model";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UnitQuery extends QueryEntity<UnitState> {
  constructor(protected store: UnitStore) {
    super(store);
  }

  public unitsByType$(
    unitType: "soldier" | "musketeer" | "knight" | "cannon"
  ): Observable<Unit[]> {
    return this.selectAll({
      filterBy: (unit) => unit.type === unitType,
    });
  }

  public deathCountByType$(
    unitType: "soldier" | "musketeer" | "knight" | "cannon"
  ): Observable<number> {
    return this.selectCount(
      (unit) => (unit.type === unitType) && (unit.tileId === null)
    );
  }

  public get unitTileIds$(): Observable<number[]> {
    return this.selectAll({
      filterBy: (unit) => unit.tileId !== null,
    }).pipe(map((units) => units.map(({ tileId }) => tileId)));
  }

  public get unitTileIds(): number[] {
    return this.getAll({
      filterBy: (unit) => unit.tileId !== null,
    }).map(({ tileId }) => tileId);
  }

  public getUnitByTileId(tileId: number): Unit {
    const units = this.getAll({
      filterBy: (unit) => unit.tileId !== null,
    });
    return units.find((unit) => unit.tileId === tileId);
  }

  public isSelectedUnit(tileId: number): boolean {
    const unit = this.getUnitByTileId(tileId);
    const activeUnitId = this.getActiveId();

    return unit.id === activeUnitId;
  }
}
