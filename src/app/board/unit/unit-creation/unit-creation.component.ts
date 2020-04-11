import { Component, OnInit } from '@angular/core';
import { Tile, TileQuery } from '../../tile/+state';
import { unitCols, Unit, UnitQuery } from '../+state';
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
  unitTypes = ['soldier', 'musketeer', 'knight', 'cannon'];

  constructor(
    private query: UnitQuery,
    private tileQuery: TileQuery,
  ) {}

  ngOnInit(): void {}

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
