import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TileService, Tile, TileQuery } from '../../tile/+state';
import { unitCols, UnitService, Unit, UnitQuery } from '../+state';
import { GameService } from 'src/app/games/+state';
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
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private query: UnitQuery,
    private service: UnitService,
    private gameService: GameService,
    private tileService: TileService,
    private tileQuery: TileQuery,
  ) {
    this.matIconRegistry.addSvgIcon(
      'fight',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/fight.svg')
    );
  }

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

  start() {
    // Switch game status to 'placement'
    this.gameService.switchStatus('placement');
    // Create the game tiles
    this.tileService.setTiles();
    // Save the units created
    this.service.setUnits();
  }

}
