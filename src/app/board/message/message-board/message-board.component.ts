import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MessageQuery } from "../+state";
import { Observable, Subscription } from "rxjs";
import { Player, PlayerQuery } from "../../player/+state";
import { firestore } from "firebase/app";
import { map } from "rxjs/operators";
import { MediaObserver } from "@angular/flex-layout";

@Component({
  selector: "app-message-board",
  templateUrl: "./message-board.component.html",
  styleUrls: ["./message-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageBoardComponent implements OnInit {
  public messages$: Observable<
    {
      title: string;
      subtitle: string;
      isActive: boolean;
      date: firestore.Timestamp;
    }[]
  >;
  public player: Player;
  private messageSub: Subscription;

  constructor(
    private query: MessageQuery,
    private playerQuery: PlayerQuery,
    public mediaObserver: MediaObserver
  ) {}

  ngOnInit(): void {
    this.messages$ = this.query.messages$.pipe(
      map((messages) => messages.sort())
    );
    this.player = this.playerQuery.getActive();
    this.messageSub = this.messages$.subscribe();
  }

  ngOndestroy(): void {
    this.messageSub.unsubscribe();
  }
}
