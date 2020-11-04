import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { MessageService } from "src/app/board/message/+state/message.service";
import { PresenceService } from "src/app/auth/presence/presence.service";
import { ConfirmationDialogComponent } from "src/app/games/pages/confirmation-dialog/confirmation-dialog.component";
import { GameQuery, GameService, decoTimer, Game } from "../+state";
import { tap, switchMap, map, filter, debounceTime } from "rxjs/operators";
import { PlayerQuery, PlayerService } from "src/app/board/player/+state";
import { Observable, Subscription, combineLatest, of, timer } from "rxjs";
import { TileService } from "src/app/board/tile/+state";
import { Router, ActivatedRoute } from "@angular/router";
import { UnitService } from "src/app/board/unit/+state";
import { OpponentUnitService } from "src/app/board/unit/opponent/+state";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

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
  private closeGameOnTimerSub$: Subscription;
  private gameIsClosedSub$: Subscription;
  private game$: Observable<Game>;
  public isOpponentReady$: Observable<boolean>;
  public isPlayerReady$: Observable<boolean>;
  private opponentPresence$: Observable<any>;
  public offlineTimer$: Observable<number>;
  public decoTimer = decoTimer;

  constructor(
    private gameQuery: GameQuery,
    private gameService: GameService,
    private unitService: UnitService,
    private opponentUnitService: OpponentUnitService,
    private playerQuery: PlayerQuery,
    private playerService: PlayerService,
    private tileService: TileService,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private presenceSercice: PresenceService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.game$ = this.gameQuery.selectActive();
    this.gameService.joinGame(this.route.snapshot.paramMap.get("id"));
    this.gameStatus$ = this.gameQuery.gameStatus$;

    this.opponentPresence$ = this.playerQuery.opponent$.pipe(
      switchMap(opponent =>
        opponent ? this.presenceSercice.selectPresence(opponent.id) : of("none")
      )
    );

    // Create a timer when the opponent is offline
    this.offlineTimer$ = combineLatest([
      this.opponentPresence$,
      this.game$
    ]).pipe(
      switchMap(([status, game]) => {
        if (game.isInstant) {
          status.status === "offline" ? timer(1000, 1000) : of(null);
        } else {
          return of(null);
        }
      })
    );

    // Close the game if the opponent is offline more than decoTimer time
    this.closeGameOnTimerSub$ = this.offlineTimer$
      .pipe(
        tap(timer =>
          timer === decoTimer ? this.gameService.markClosed() : false
        )
      )
      .subscribe();

    // Consider opponent has left if game is closed
    this.gameIsClosedSub$ = this.game$
      .pipe(
        filter(game =>
          game ? game.status !== "finished" && game.isClosed : false
        ),
        map(game => (game ? game.isClosed : false)),
        debounceTime(1000),
        tap(isClosed => (isClosed ? this.oppHasLeft() : false))
      )
      .subscribe();

    // Check if there are 2 players to start the game
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

    // Check if players are ready and update game status accordingly
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

    // Check if players want to rematch and update game status accordingly
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

  // Ask if the user really wants to leave when instant games
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

    if (game.isInstant && !game.isClosed) {
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

  // Close the game or delete it when player leaves
  async playerLeft() {
    const game = this.gameQuery.getActive();
    if (game) {
      // check if the game is instant & open
      if (game.isInstant && !game.isClosed) {
        // delete it if there is only one player
        if (game.playerIds.length === 1) {
          this.gameService.deleteGame(game.id);
          // otherwise close it
        } else {
          await this.gameService.markClosed();
          this.messageService.openSnackBar("Game closed.");
        }
      }
    }
  }

  // Give victory or delete the game when opponent leaves
  private async oppHasLeft() {
    const game = this.gameQuery.getActive();

    if (game.status !== "finished") {
      // if game was started, gives victory to the active player
      if (game.status === "battle") {
        this.messageService.openSnackBar("Your opponent has left the game.");
        const opponent = this.playerQuery.opponent;
        const player = this.playerQuery.getActive();
        await this.gameService.switchStatus("finished");
        this.playerService.setVictorious(player, opponent);
        // else delete the game
      } else {
        await this.router.navigate(["/home"]);
        this.messageService.openSnackBar("Your opponent has left the game.");
        await this.gameService.deleteGame(game.id);
      }
    }
  }

  ngOnDestroy() {
    this.playerLeft();
    this.closeGameOnTimerSub$ ? this.closeGameOnTimerSub$.unsubscribe() : false;
    this.gameIsClosedSub$ ? this.gameIsClosedSub$.unsubscribe() : false;
    this.playersCountSub$ ? this.playersCountSub$.unsubscribe() : false;
    this.playersReadyCountSub$
      ? this.playersReadyCountSub$.unsubscribe()
      : false;
    this.playersRematchCountSub$
      ? this.playersRematchCountSub$.unsubscribe()
      : false;
  }
}
