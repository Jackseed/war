import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { UnitService } from "../../unit/+state";
import { GameService, GameQuery } from "src/app/games/+state";
import { PlayerQuery, PlayerService } from "../../player/+state";
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
    this.isPlayerReady$ = this.gameQuery.isPlayerReady;
    this.matIconRegistry.addSvgIcon(
      "fight",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/fight.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "flag",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/flag.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "camp",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/camp.svg"
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

  public forfeit(): void {
    const game = this.gameQuery.getActive();

    if (game.status === "battle") {
      const loser = this.playerQuery.getActive();
      const winner = this.playerQuery.opponent;
      this.gameService.switchStatus("finished");
      this.playerService.setVictorious(winner, loser);
    }
  }
}
