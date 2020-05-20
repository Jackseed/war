import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Game, GameQuery } from "../../+state";

@Component({
  selector: "app-join",
  templateUrl: "./join.component.html",
  styleUrls: ["./join.component.scss"],
})
export class JoinComponent implements OnInit {
  public otherGames$: Observable<Game[]>;

  constructor(
    private gameQuery: GameQuery,
  ) {}

  ngOnInit(): void {
    this.otherGames$ = this.gameQuery.otherGames;
  }
}
