import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { UnitService } from "../../unit/+state";
import { GameService, GameQuery } from "src/app/games/+state";
import { PlayerQuery, Player, PlayerService } from "../../player/+state";
import { Observable } from "rxjs";
import { TileService } from "../../tile/+state";

@Component({
  selector: "app-bottom-bar",
  templateUrl: "./bottom-bar.component.html",
  styleUrls: ["./bottom-bar.component.scss"],
})
export class BottomBarComponent implements OnInit {
  public gameStatus$: Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  >;
  public players$: Observable<Player[]>;
  public isPlayerReady$: Observable<boolean>;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private unitService: UnitService,
    private gameQuery: GameQuery,
    private gameService: GameService,
    private playerQuery: PlayerQuery,
    private playerService: PlayerService,
    private tileService: TileService
  ) {
    this.gameStatus$ = this.gameQuery.gameStatus$;
    this.players$ = this.playerQuery.selectAll();
    this.isPlayerReady$ = this.gameQuery.isPlayerReady;
    this.matIconRegistry.addSvgIcon(
      "fight",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/fight.svg"
      )
    );
  }

  ngOnInit(): void {}

  setReady() {
    const playerId = this.playerQuery.getActiveId();
    const gameStatus = this.gameQuery.getActive().status;

    // Mark the player as ready
    this.gameService.markReady(playerId);

    // Save the units created
    if (gameStatus === "unit creation") {
      this.unitService.setUnits();
    }
  }

  skipTurn() {
    this.tileService.removeReachable();
    this.tileService.removeSelected();
    this.tileService.removeInRangeTiles();
    this.playerService.switchActivePlayer();
  }
}
