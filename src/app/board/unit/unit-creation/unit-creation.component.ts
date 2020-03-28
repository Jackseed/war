import { Component, OnInit } from '@angular/core';
import { TileService, Tile, TileQuery } from '../../tile/+state';
import { unitBoardSize, Unit, UnitQuery, UnitService } from '../+state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-unit-creation',
  templateUrl: './unit-creation.component.html',
  styleUrls: ['./unit-creation.component.scss']
})
export class UnitCreationComponent implements OnInit {
  unitBoardSize = unitBoardSize;
  soldierTiles$: Observable<Tile[]>;
  soldierTilesWithUnits$: Observable<Tile[]>;
  soldiers$: Observable<Unit[]>;

  constructor(
    private query: UnitQuery,
    private service: UnitService,
    private tileService: TileService,
    private tileQuery: TileQuery,
  ) {}

  ngOnInit(): void {
    this.tileService.createUnitTiles(unitBoardSize, 'soldier');
    this.soldierTiles$ = this.tileQuery.selectAll({
      filterBy: tile => tile.unitCreationType === 'soldier'
    });
    this.soldiers$ = this.query.selectAll({
      filterBy: unit => unit.type === 'soldier'
    });
    this.soldierTilesWithUnits$ = this.tileQuery.combineTileWithUIandUnits(this.soldierTiles$, this.soldiers$, false);
  }

}
