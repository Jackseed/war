import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../+state";
import { actionsPerTurn } from "src/app/games/+state";

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

  constructor() {}

  ngOnInit(): void {
    if (this.isOpponent) {
      this.playerName = "You";
    } else {
      this.playerName = "Opponent";
    }
  }
}
