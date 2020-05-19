import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../+state";
import { actionsPerTurn, GameQuery } from "src/app/games/+state";

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
  public gameStatus$: Observable<
  "not started" | "waiting" | "unit creation" | "placement" | "battle" | "finished"
  >;

  constructor(private gameQuery: GameQuery) {}

  ngOnInit(): void {
    this.gameStatus$ = this.gameQuery.gameStatus$;
    if (!this.isOpponent) {
      this.playerName = "You";
    } else {
      this.playerName = "Opponent";
    }
  }
}
