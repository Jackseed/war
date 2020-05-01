import { Component, OnInit } from "@angular/core";
import { MessageQuery } from "../+state";
import { Observable } from "rxjs";
import { Player, PlayerQuery } from "../../player/+state";

@Component({
  selector: "app-message-board",
  templateUrl: "./message-board.component.html",
  styleUrls: ["./message-board.component.scss"],
})
export class MessageBoardComponent implements OnInit {
  public messages$: Observable<{ title: string; subtitle: string }[]>;
  public player: Player;

  constructor(private query: MessageQuery, private playerQuery: PlayerQuery) {}

  ngOnInit(): void {
    this.messages$ = this.query.messages$;
    this.player = this.playerQuery.getActive();
  }
}
