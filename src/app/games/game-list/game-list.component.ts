import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { GameService, Game } from "../+state";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.scss"],
})
export class GameListComponent implements OnInit {
  @Input() games$: Observable<Game[]>;

  constructor(private service: GameService) {}

  ngOnInit() {}

  joinGame(game: Game) {
    this.service.joinGame(game);
  }
}
