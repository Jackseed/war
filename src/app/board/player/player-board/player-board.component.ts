import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import { Player } from "../+state";

@Component({
  selector: "app-player-board",
  templateUrl: "./player-board.component.html",
  styleUrls: ["./player-board.component.scss"],
})
export class PlayerBoardComponent implements OnInit {
  @Input() player$: Observable<Player>;

  constructor() {}

  ngOnInit(): void {}
}
