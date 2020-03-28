import { Component, OnInit } from '@angular/core';
import { TileService, Tile, TileQuery } from '../../tile/+state';
import { unitBoardSize } from '../+state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-unit-creation',
  templateUrl: './unit-creation.component.html',
  styleUrls: ['./unit-creation.component.scss']
})
export class UnitCreationComponent implements OnInit {
  unitBoardSize = unitBoardSize;
  soldierTiles$: Observable<Tile[]>;

  constructor(
    private tileService: TileService,
    private tileQuery: TileQuery,
  ) {}

  ngOnInit(): void {
    this.tileService.createUnitTiles(unitBoardSize, 'soldier');
    this.soldierTiles$ = this.tileQuery.selectAll({
      filterBy: entity => entity.unitCreationType === 'soldier'
    });
  }

}
