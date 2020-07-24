import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { GameQuery } from "../../+state/game.query";
import { Game } from "../../+state/game.model";
import { map } from "rxjs/operators";

@Component({
  selector: "app-game-history",
  templateUrl: "./game-history.component.html",
  styleUrls: ["./game-history.component.scss"],
})
export class GameHistoryComponent implements OnInit {
  public playerGames$: Observable<Game[]>;

  constructor(private gameQuery: GameQuery) {}

  ngOnInit(): void {
    this.playerGames$ = this.gameQuery.playerGames.pipe(
      map((games) => games.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }
}
