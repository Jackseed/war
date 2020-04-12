import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UnitService } from '../../unit/+state';
import { GameService, GameQuery } from 'src/app/games/+state';
import { TileService } from '../../tile/+state';
import { PlayerQuery, Player } from '../../player/+state';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss']
})
export class BottomBarComponent implements OnInit {
  public gameStatus$: Observable<'unit creation' | 'placement' | 'battle' | 'finished'>;
  public players$: Observable<Player[]>;
  public isPlayerReady$: Observable<boolean>;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private unitService: UnitService,
    private gameQuery: GameQuery,
    private gameService: GameService,
    private tileService: TileService,
    private playerQuery: PlayerQuery,
  ) {
    this.gameStatus$ = this.gameQuery.selectActive().pipe(
      map(game => game.status)
    );
    this.players$  = this.playerQuery.selectAll();
    this.isPlayerReady$ = this.gameQuery.isPlayerReady;
    this.matIconRegistry.addSvgIcon(
      'fight',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/fight.svg')
    );
  }

  ngOnInit(): void {
  }

  setReady() {
    const playerId = this.playerQuery.getActiveId();
    // Mark the player as ready & get the count
    const playersReadyCount = this.gameService.markReady(playerId);

    if (playersReadyCount === 1) {
      // Create the game tiles when the first player is ready
      this.tileService.setTiles();
      // Save the units created
      this.unitService.setUnits();
    } else if (playersReadyCount === 2) {
      // Save the units created
      this.unitService.setUnits();
    }
  }

}
