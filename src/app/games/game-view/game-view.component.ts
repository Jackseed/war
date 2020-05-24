import { Component, OnInit, OnDestroy } from "@angular/core";
import { GameQuery, GameService } from "../+state";
import { tap } from "rxjs/operators";
import { PlayerQuery } from "src/app/board/player/+state";
import { Observable, Subscription, combineLatest } from "rxjs";
import { TileService } from "src/app/board/tile/+state";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.scss"],
})
export class GameViewComponent implements OnInit, OnDestroy {
  public gameStatus$: Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  >;
  private playersReadyCountSub$: Subscription;
  private playersCountSub$: Subscription;

  constructor(
    private gameQuery: GameQuery,
    private gameService: GameService,
    private playerQuery: PlayerQuery,
    
    private tileService: TileService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.gameService.joinGame(this.route.snapshot.paramMap.get("id"));
    this.gameStatus$ = this.gameQuery.gameStatus$;
    this.playersCountSub$ = combineLatest([
      this.playerQuery.selectCount(),
      this.gameStatus$,
    ])
      .pipe(
        tap(([count, gameStatus]) =>
          count === 2 && gameStatus === "waiting"
            ? this.gameService.switchStatus("unit creation")
            : false
        )
      )
      .subscribe();

    this.playersReadyCountSub$ = combineLatest([
      this.gameQuery.playersReadyCount,
      this.gameStatus$,
    ])
      .pipe(
        tap(([count, gameStatus]) => {
          if (count === 2 && gameStatus === "unit creation") {
            this.gameService.switchStatus("placement");
          } else if (count === 2 && gameStatus === "placement") {
            this.tileService.removeReachable();
            this.tileService.removeSelected();
            this.gameService.switchStatus("battle");
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.playersCountSub$.unsubscribe();
    this.playersReadyCountSub$.unsubscribe();
  }
}
