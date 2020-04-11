import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UnitService } from '../../unit/+state';
import { GameService, GameQuery } from 'src/app/games/+state';
import { TileService } from '../../tile/+state';
import { PlayerQuery } from '../../player/+state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss']
})
export class BottomBarComponent implements OnInit {
  public gameStatus$ = this.gameQuery.selectActive().pipe(
    map(game => game.status)
  );
  public players$ = this.playerQuery.selectAll();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private unitService: UnitService,
    private gameQuery: GameQuery,
    private gameService: GameService,
    private tileService: TileService,
    private playerQuery: PlayerQuery,
  ) {
    this.matIconRegistry.addSvgIcon(
      'fight',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/fight.svg')
    );
  }

  ngOnInit(): void {
  }

  start() {
    // Switch game status to 'placement'
    this.gameService.switchStatus('placement');
    // Create the game tiles
    this.tileService.setTiles();
    // Save the units created
    this.unitService.setUnits();
  }

}
