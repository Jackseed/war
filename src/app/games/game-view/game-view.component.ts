import { Component, OnInit, OnDestroy } from "@angular/core";
import { GameQuery, GameService } from "../+state";
import { tap, switchMap } from "rxjs/operators";
import { PlayerQuery } from "src/app/board/player/+state";
import { Observable, Subscription, combineLatest, of } from "rxjs";
import { TileService } from "src/app/board/tile/+state";
import { Router, ActivatedRoute } from "@angular/router";
import { UnitService } from "src/app/board/unit/+state";
import { OpponentUnitService } from "src/app/board/unit/opponent/+state";

@Component({
  selector: "app-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.scss"]
})
export class GameViewComponent implements OnInit, OnDestroy {
  public gameStatus$: Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  >;
  private playersReadyCountSub$: Subscription;
  private playersRematchCountSub$: Subscription;
  private playersCountSub$: Subscription;
  public isOpponentReady$: Observable<boolean>;
  public isPlayerReady$: Observable<boolean>;

  constructor(
    private gameQuery: GameQuery,
    private gameService: GameService,
    private unitService: UnitService,
    private opponentUnitService: OpponentUnitService,
    private playerQuery: PlayerQuery,
    private tileService: TileService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.gameService.joinGame(this.route.snapshot.paramMap.get("id"));
    this.gameStatus$ = this.gameQuery.gameStatus$;

    this.isPlayerReady$ = this.gameQuery.isPlayerReady;
    this.isOpponentReady$ = this.playerQuery
      .selectCount()
      .pipe(
        switchMap(count =>
          count === 2
            ? (this.isOpponentReady$ = this.playerQuery.isOpponentReady)
            : of(false)
        )
      );

    this.playersCountSub$ = combineLatest([
      this.playerQuery.selectCount(),
      this.gameStatus$
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
      this.gameStatus$
    ])
      .pipe(
        tap(([count, gameStatus]) => {
          if (count === 2 && gameStatus === "unit creation") {
            this.gameService.switchStatus("placement");
          } else if (count === 2 && gameStatus === "placement") {
            this.tileService.removeReachable();
            this.tileService.removeSelected();
            this.gameService.switchStatus("battle");
            this.gameService.resetReady();
          }
        })
      )
      .subscribe();

    this.playersRematchCountSub$ = this.gameQuery.playersRematchCount
      .pipe(
        tap(count => {
          if (count === 2) {
            const player = this.playerQuery.getActive();
            this.unitService.deleteAll();
            this.opponentUnitService.deleteAll();
            this.tileService.removeReachable();
            this.tileService.removeSelected();

            // this is to prevent double match count
            if (player.color === "black") {
              this.gameService.rematch();
            }
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.playersCountSub$.unsubscribe();
    this.playersReadyCountSub$.unsubscribe();
    this.playersRematchCountSub$.unsubscribe();
  }
}
