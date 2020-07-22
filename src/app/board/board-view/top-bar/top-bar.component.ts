import { Component, OnInit } from "@angular/core";
import { GameQuery, Game } from "src/app/games/+state";
import { Observable } from "rxjs";
import { AuthService, AuthQuery } from "src/app/auth/+state";
import { MediaObserver } from "@angular/flex-layout";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.scss"],
})
export class TopBarComponent implements OnInit {
  public game$: Observable<Game>;
  public isOpen: boolean;

  constructor(
    public authQuery: AuthQuery,
    public authService: AuthService,
    private gameQuery: GameQuery,
    public mediaObserver: MediaObserver
  ) {}

  ngOnInit() {
    this.game$ = this.gameQuery.selectActive();
    this.isOpen = this.authQuery.getIsOpen();
  }
}
