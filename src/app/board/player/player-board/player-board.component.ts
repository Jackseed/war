import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../+state";
import { actionsPerTurn, GameQuery } from "src/app/games/+state";
import { AuthQuery, User } from "src/app/auth/+state";
import { map } from "rxjs/operators";

@Component({
  selector: "app-player-board",
  templateUrl: "./player-board.component.html",
  styleUrls: ["./player-board.component.scss"],
})
export class PlayerBoardComponent implements OnInit {
  @Input() player$: Observable<Player>;
  @Input() isOpponent: boolean;
  public actionsPerTurn = actionsPerTurn;
  public user$: Observable<User>;
  public playerName: string;
  public gameStatus$: Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  >;

  constructor(private gameQuery: GameQuery, private authQuery: AuthQuery) {}

  ngOnInit(): void {
    this.gameStatus$ = this.gameQuery.gameStatus$;
    if (!this.isOpponent) {
      this.playerName = "You";
    } else {
      this.playerName = "Opponent";
    }

    this.user$ = this.player$.pipe(
      map((player) => player.id),
      map((playerId) => this.authQuery.getEntity(playerId))
    );
  }
}
