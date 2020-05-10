import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { Player, PlayerService, PlayerQuery } from "../+state";
import { actionsPerTurn, GameService } from "src/app/games/+state";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { TileService } from "../../tile/+state";


@Component({
  selector: "app-player-board",
  templateUrl: "./player-board.component.html",
  styleUrls: ["./player-board.component.scss"],
})
export class PlayerBoardComponent implements OnInit {
  @Input() player$: Observable<Player>;
  @Input() isOpponent: boolean;
  public actionsPerTurn = actionsPerTurn;
  public playerName: string;

  constructor(
    private query: PlayerQuery,
    private service: PlayerService,
    private gameService: GameService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private tileService: TileService,
  ) {
    this.matIconRegistry.addSvgIcon(
      "flag",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/flag.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "camp 4",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/camp 4.svg"
      )
    );
  }

  ngOnInit(): void {
    if (!this.isOpponent) {
      this.playerName = "You";
    } else {
      this.playerName = "Opponent";
    }
  }

  public skipTurn(): void {
    this.tileService.removeReachable();
    this.tileService.removeSelected();
    this.tileService.removeInRangeTiles();
    this.service.switchActivePlayer();
  }

  public forfeit(): void {
    const loser = this.query.getActive();
    const winner = this.query.opponent;
    this.gameService.switchStatus("finished");
    this.service.setVictorious(winner, loser);
  }

}
