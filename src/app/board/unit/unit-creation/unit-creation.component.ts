import { Component, OnInit } from '@angular/core';
import { TileService, Tile, TileQuery } from '../../tile/+state';
import { unitCols, unitMaxTiles, Unit, UnitQuery } from '../+state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-unit-creation',
  templateUrl: './unit-creation.component.html',
  styleUrls: ['./unit-creation.component.scss']
})
export class UnitCreationComponent implements OnInit {
  cols = unitCols;
  soldierTiles$: Observable<Tile[]>;
  soldierTilesWithUnits$: Observable<Tile[]>;
  soldiers$: Observable<Unit[]>;
  unitTypes = ['soldier', 'musketeer', 'knight', 'canon'];

  constructor(
    private query: UnitQuery,
    private tileService: TileService,
    private tileQuery: TileQuery,
  ) {}

  ngOnInit(): void {
    for (const unitType of this.unitTypes) {
      this.tileService.createUnitTiles(unitCols, unitType, unitMaxTiles);
    }
  }

  createUnitTiles(unitType) {
    this.tileService.createUnitTiles(unitCols, unitType, unitMaxTiles);
  }

  selectUnitTiles(unitType): Observable<Tile[]> {
    const unitTiles$: Observable<Tile[]> = this.tileQuery.selectAll({
      filterBy: tile => tile.unitCreationType === unitType
    });
    const units$: Observable<Unit[]> = this.query.selectAll({
      filterBy: unit => unit.type === unitType
    });
    return this.tileQuery.combineTileWithUIandUnits(unitTiles$, units$, false);
  }

}
