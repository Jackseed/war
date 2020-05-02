import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MessageQuery } from "../+state";
import { Observable, Subscription } from "rxjs";
import { Player, PlayerQuery } from "../../player/+state";
import { firestore } from "firebase/app";

@Component({
  selector: "app-message-board",
  templateUrl: "./message-board.component.html",
  styleUrls: ["./message-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageBoardComponent implements OnInit {
  public messages$: Observable<{ title: string; subtitle: string, isActive: boolean, date: firestore.Timestamp }[]>;
  public player: Player;
  private messageSub: Subscription;

  constructor(private query: MessageQuery, private playerQuery: PlayerQuery) {}

  ngOnInit(): void {
    this.messages$ = this.query.messages$;
    this.player = this.playerQuery.getActive();
    this.messageSub = this.messages$.subscribe(console.log);
  }

  ngOndestroy(): void {
    this.messageSub.unsubscribe();
  }
}
