import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Game, GameQuery } from "../../+state";
import { map } from "rxjs/operators";

@Component({
  selector: "app-join",
  templateUrl: "./join.component.html",
  styleUrls: ["./join.component.scss"],
})
export class JoinComponent implements OnInit {
  public otherGames$: Observable<Game[]>;

  constructor(private gameQuery: GameQuery) {}

  ngOnInit(): void {
    this.otherGames$ = this.gameQuery.otherGames.pipe(
      map((games) => games.filter((game) => game.playerIds.length < 1))
    );
  }
}
