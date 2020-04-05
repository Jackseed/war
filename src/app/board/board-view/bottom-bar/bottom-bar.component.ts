import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UnitService } from '../../unit/+state';
import { GameService } from 'src/app/games/+state';
import { TileService } from '../../tile/+state';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss']
})
export class BottomBarComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private unitService: UnitService,
    private gameService: GameService,
    private tileService: TileService,
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
