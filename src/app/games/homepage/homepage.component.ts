import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { AuthService } from "src/app/auth/+state";
import { GameService, GameQuery, Game } from "../+state";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public playerGames$: Observable<Game[]>;

  constructor(
    public auth: AuthService,
    private gameQuery: GameQuery,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.sub = this.gameService.syncCollection().subscribe();
    this.playerGames$ = this.gameQuery.playerGames;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
