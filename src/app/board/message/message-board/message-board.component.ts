import { Component, OnInit } from "@angular/core";
import { MessageQuery } from "../+state";
import { Observable } from "rxjs";
import { Player, PlayerQuery } from "../../player/+state";
import { firestore } from "firebase/app";
import { map } from "rxjs/operators";
import { MediaObserver } from "@angular/flex-layout";

@Component({
  selector: "app-message-board",
  templateUrl: "./message-board.component.html",
  styleUrls: ["./message-board.component.scss"],
})
export class MessageBoardComponent implements OnInit {
  public messages$: Observable<
    {
      content: string;
      isActive: boolean;
      date: firestore.Timestamp;
    }[]
  >;
  public player: Player;

  constructor(
    private query: MessageQuery,
    private playerQuery: PlayerQuery,
    public mediaObserver: MediaObserver
  ) {}

  ngOnInit(): void {
    this.messages$ = this.query.messages$.pipe(
      map((messages) =>
        messages.sort(
          (a, b) =>
            new Date(b.date.toDate()).getTime() -
            new Date(a.date.toDate()).getTime()
        )
      )
    );
    this.player = this.playerQuery.getActive();
  }
}
