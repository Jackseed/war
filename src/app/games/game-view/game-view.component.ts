import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { PresenceService } from 'src/app/auth/presence/presence.service';
import { ConfirmationDialogComponent } from "src/app/games/pages/confirmation-dialog/confirmation-dialog.component";
import { GameQuery, GameService } from "../+state";
import { tap, switchMap } from "rxjs/operators";
import { PlayerQuery } from "src/app/board/player/+state";
import { Observable, Subscription, combineLatest, of } from "rxjs";
import { TileService } from "src/app/board/tile/+state";
import { Router, ActivatedRoute } from "@angular/router";
import { UnitService } from "src/app/board/unit/+state";
import { OpponentUnitService } from "src/app/board/unit/opponent/+state";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.scss"],
  host: { "window:onunload": "closeGame" }
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
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private presenceSercice: PresenceService,
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

  // Ask the user if he really wants to leave when instant games
  @HostListener("window:beforeunload")
  canLeavePage() {
    const game = this.gameQuery.getActive();
    if (!game.isInstant) {
      return;
    } else {
      return false;
    }
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    const game = this.gameQuery.getActive();

    if (game.isInstant) {
      this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false
      });
      this.dialogRef.componentInstance.message =
        "Are you sure you want to leave?";
    } else {
      return true;
    }
    return this.dialogRef.afterClosed();
  }

  closeGame() {
    const game = this.gameQuery.getActive();
    const playerId = this.playerQuery.getActiveId();

    if (game.isInstant && !game.isClosed) {
      console.log("here");
      this.gameService.markClosed();
      this.gameService.removePlayer(playerId);
    }
  }

  ngOnDestroy() {
    this.closeGame();
    this.playersCountSub$.unsubscribe();
    this.playersReadyCountSub$.unsubscribe();
    this.playersRematchCountSub$.unsubscribe();
  }
}
