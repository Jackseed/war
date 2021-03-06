import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Observable, Subscription, combineLatest, of } from "rxjs";
import { User } from "../../auth/+state";
import { MessagingService } from "src/app/auth/messaging/messaging.service";
import { Tile, TileQuery, TileService } from "../tile/+state";
import { Unit, UnitQuery, UnitService } from "../unit/+state";
import {
  boardCols,
  Castle,
  actionsPerTurn,
  decoTimer,
  Game,
  GameService,
  GameQuery
} from "src/app/games/+state";
import { map, tap, distinctUntilChanged, filter } from "rxjs/operators";
import {
  OpponentUnitService,
  OpponentUnitQuery,
  OpponentUnitStore
} from "../unit/opponent/+state";
import { Player, PlayerQuery, PlayerService } from "../player/+state";
import { DomSanitizer } from "@angular/platform-browser";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { AuthService, AuthQuery } from "src/app/auth/+state";
import { MessageService } from "../message/+state";
import { Capacitor } from "@capacitor/core";
import { AngularFireAnalytics } from "@angular/fire/analytics";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit, OnDestroy {
  @Input() offlineTimer$: Observable<number>;
  // Subscriptions
  private oppUnitsync: Subscription;
  private castleVictorySub: Subscription;
  private noUnitVictorySub: Subscription;
  private finishedSub: Subscription;
  private isActiveSub: Subscription;
  private dyingUnitsSub: Subscription;
  private watcher: Subscription;
  private permissionSub: Subscription;

  // Fixed variables
  public boardSize = boardCols;
  public actionsPerTurn = actionsPerTurn;
  public player: Player;
  public opponentPlayer: Player;
  public castle: Castle;
  public opponentCastle: Castle;
  public castleIds: number[];
  public isWhiteOpponent: boolean;
  public isBlackOpponent: boolean;
  public decoTimer = decoTimer;

  // Observables
  public isOpen$: Observable<boolean>;
  public game$: Observable<Game>;
  public gameStatus$: Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  >;

  public user$: Observable<User>;
  public player$: Observable<Player>;
  public whitePlayer$: Observable<Player>;
  public blackPlayer$: Observable<Player>;

  public tiles$: Observable<Tile[]>;
  public unitTileIds$: Observable<number[]>;
  public visibleOpponentUnitTileIds$: Observable<number[]>;
  public visibleTileIds$: Observable<number[]>;

  constructor(
    private authQuery: AuthQuery,
    private authService: AuthService,
    private gameQuery: GameQuery,
    private gameService: GameService,
    private tileQuery: TileQuery,
    private tileService: TileService,
    private unitQuery: UnitQuery,
    private unitService: UnitService,
    private playerQuery: PlayerQuery,
    private playerService: PlayerService,
    private opponentUnitStore: OpponentUnitStore,
    private opponentUnitService: OpponentUnitService,
    private opponentUnitQuery: OpponentUnitQuery,
    private messageService: MessageService,
    private messagingService: MessagingService,
    public sanitizer: DomSanitizer,
    public mediaObserver: MediaObserver,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit() {
    this.user$ = this.authQuery.selectActive();
    this.game$ = this.gameQuery.selectActive();

    // Prepare push notifications
    if (Capacitor.platform === "web") {
      this.permissionSub = this.user$.subscribe(user => {
        if (user) {
          this.messagingService.getPermission(user);
        }
      });
    } else {
      this.messagingService.registerMobilePush();
    }

    this.gameStatus$ = this.gameQuery.gameStatus$;
    this.watcher = this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        if (
          change.mqAlias === "xs" ||
          change.mqAlias === "sm" ||
          change.mqAlias === "md"
        ) {
          this.authService.updateIsOpen(false);
        } else {
          this.authService.updateIsOpen(true);
        }
      });
    this.isOpen$ = this.authQuery.selectIsOpen();
    this.tileService.setTiles();
    this.oppUnitsync = this.game$
      ? this.opponentUnitService.syncCollection().subscribe()
      : of(false).subscribe();
    this.tiles$ = this.tileQuery.selectAll();
    this.player = this.playerQuery.getActive();
    this.player$ = this.playerQuery.selectActive();
    this.opponentPlayer = this.playerQuery.opponent;
    this.castle = Castle(this.player.color);
    this.opponentCastle = Castle(this.opponentPlayer.color);
    this.castleIds = [this.castle.tileId, this.opponentCastle.tileId];

    // get the visible tile ids, except during placement
    this.visibleTileIds$ = combineLatest([
      this.gameStatus$,
      this.tileQuery.visibleTileIds$,
      this.player$
    ]).pipe(
      map(([status, visibleTiles, player]) => {
        if (status === "placement") {
          if (player.color === "black") {
            return this.tileQuery.getTileColumnsByNumber(
              boardCols - 1,
              5,
              true
            );
          } else {
            return this.tileQuery.getTileColumnsByNumber(0, 5, false);
          }
        } else {
          return visibleTiles;
        }
      })
    );

    // get unit tile ids
    this.unitTileIds$ = this.unitQuery.unitTileIds$;

    // get opponent visible unit tile ids
    this.visibleOpponentUnitTileIds$ = this.opponentUnitQuery.visibleUnits$.pipe(
      map(units => units.map(({ tileId }) => tileId))
    );

    // define the player color for player board
    if (this.player.color === "white") {
      this.whitePlayer$ = this.playerQuery.selectActive();
      this.blackPlayer$ = this.playerQuery.opponent$;
      this.isWhiteOpponent = false;
      this.isBlackOpponent = true;
    } else {
      this.whitePlayer$ = this.playerQuery.opponent$;
      this.blackPlayer$ = this.playerQuery.selectActive();
      this.isWhiteOpponent = true;
      this.isBlackOpponent = false;
    }

    // check if a player unit is on the opponent castle, if so stop the game
    this.castleVictorySub = this.unitTileIds$
      .pipe(
        map(unitTileIds =>
          unitTileIds.map(unitTileId => {
            if (unitTileId === this.opponentCastle.tileId) {
              this.analytics.logEvent("win_castle");
              this.gameService.switchStatus("finished");
              this.playerService.setVictorious(
                this.player,
                this.opponentPlayer
              );
            }
          })
        )
      )
      .subscribe();

    // check if a player has no unit anymore
    this.noUnitVictorySub = combineLatest([
      this.unitQuery.selectCount(unit => unit.tileId !== null),
      this.unitQuery.selectLoading(),
      this.gameStatus$
    ])
      .pipe(
        map(([unitCount, unitLoading, gameStatus]) => {
          if (gameStatus === "battle" && !unitLoading) {
            if (unitCount === 0) {
              this.analytics.logEvent("win_units");
              this.gameService.switchStatus("finished");
              this.playerService.setVictorious(
                this.opponentPlayer,
                this.player
              );
            }
          }
        })
      )
      .subscribe();

    // when the game is finished, turn all the tiles & units visible
    this.finishedSub = this.gameStatus$
      .pipe(
        map(gameStatus => {
          if (gameStatus === "finished") {
            this.visibleTileIds$ = this.tileQuery.tileIds$;
            this.visibleOpponentUnitTileIds$ = this.opponentUnitQuery.unitTileIds$;
          }
        })
      )
      .subscribe();

    // Emit a sound when it's player's turn
    this.isActiveSub = this.playerQuery
      .selectActive()
      .pipe(
        map(player => player.isActive),
        distinctUntilChanged(),
        tap(isActive => {
          if (isActive) {
            this.playAudio();
          }
        })
      )
      .subscribe();

    this.dyingUnitsSub = this.unitService.dyingUnit$.subscribe();
  }

  play(i: number) {
    const tile = this.tileQuery.getEntity(i.toString());
    const unitTileIds = this.unitQuery.unitTileIds;
    const opponentUnitTileIds = this.opponentUnitQuery.unitTileIds;
    const selectedUnit = this.unitQuery.getActive();
    const game = this.gameQuery.getActive();
    const player = this.playerQuery.getActive();

    if (game.status === "placement") {
      // check if the player clicked on its own unit
      if (unitTileIds.includes(i)) {
        // check if a unit wasn't already selected, then selects this one
        if (!this.unitQuery.hasActive()) {
          this.tileService.markAsSelected(i);
          // else, check if the clicked unit is not the same as the already selected
          // if not, swap the positions
        } else if (!this.unitQuery.isSelectedUnit(i)) {
          this.unitService.swapUnitPositions(i);
          this.tileService.removeSelected();
        }
      } else if (this.unitQuery.hasActive() && tile.isReachable) {
        this.unitService.updatePosition(selectedUnit, i);
        this.tileService.removeSelected();
      }
    }

    if (game.status === "battle") {
      // Check if the player is active & has not made too many actions
      if (player.isActive && player.actionCount < actionsPerTurn) {
        // If a unit was clicked and belongs to player, turns it selected
        if (unitTileIds.includes(i)) {
          this.tileService.removeReachable();
          this.tileService.removeSelected();
          this.tileService.removeInRangeTiles();

          this.tileService.markAsSelected(i);
          // Check if the unit can move
          if (this.unitQuery.getUnitByTileId(i).stamina > 0) {
            this.tileService.markAdjacentTilesReachable(i);
          }
          this.tileService.markWithinRangeTiles(i);
          // Else, if a unit is selected..
        } else if (this.unitQuery.hasActive()) {
          // and clicked in a tile within range, then attack
          if (tile.withinRange) {
            this.unitService.attack(selectedUnit, i);

            this.tileService.removeReachable();
            this.tileService.removeSelected();
            this.tileService.removeInRangeTiles();

            // increment action count and switch active player if needed
            this.playerService.actionPlayed();

            // and clicked on reachable tile without opponent, the unit moves to the tile
          } else if (
            tile.isReachable &&
            !opponentUnitTileIds.includes(i) &&
            selectedUnit.stamina > 0 &&
            i !== this.castle.tileId
          ) {
            this.unitService.updatePosition(selectedUnit, i);

            this.tileService.removeReachable();
            this.tileService.removeSelected();
            this.tileService.removeInRangeTiles();
            // increment action count and switch active player if needed
            this.playerService.actionPlayed();
          } else {
            if (selectedUnit.stamina === 0) {
              this.tileService.removeReachable();
              this.tileService.removeSelected();
              this.tileService.removeInRangeTiles();
              this.messageService.openSnackBar(
                "This battalion needs to rest first."
              );
            } else {
              this.tileService.removeReachable();
              this.tileService.removeSelected();
              this.tileService.removeInRangeTiles();
              this.messageService.openSnackBar("You cannot reach this place.");
            }
          }
        }
      } else {
        this.messageService.openSnackBar("It's not your turn.");
      }
    }

    // Check if the game is ongoing
    if (game.status === "finished") {
      this.messageService.openSnackBar("Game is over.");
    }
  }

  public getUnitByTileId(tileId: number): Unit {
    return this.unitQuery.getUnitByTileId(tileId);
  }

  public getOpponentUnitByTileId(tileId: number): Unit {
    return this.opponentUnitQuery.getUnitByTileId(tileId);
  }

  // Remove the unit focus when using "esc" keyboard
  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    const game = this.gameQuery.getActive();
    if (event.key === "Escape" && game.status === "battle") {
      this.tileService.removeReachable();
      this.tileService.removeSelected();
      this.tileService.removeInRangeTiles();
    }
  }

  getUnitImgUrl(i: number): string {
    let url: string;
    const unitTileIds = this.unitQuery.unitTileIds;
    const oppUnitTileIds = this.opponentUnitQuery.unitTileIds;

    if (unitTileIds.includes(i)) {
      url = `/assets/img/${this.getUnitByTileId(i).color}_${
        this.getUnitByTileId(i).type
      }.png`;
    } else if (oppUnitTileIds.includes(i)) {
      url = `/assets/img/${this.getOpponentUnitByTileId(i).color}_${
        this.getOpponentUnitByTileId(i).type
      }.png`;
    } else if (this.castle.tileId === i) {
      url = `/assets/img/${this.castle.color}_castle.png`;
    } else if (this.opponentCastle.tileId === i) {
      url = `/assets/img/${this.opponentCastle.color}_castle.png`;
    } else {
      url = "";
    }
    return url;
  }

  private playAudio() {
    const audio = new Audio();
    audio.src = "../../../assets/audio/change_turn.wav";
    audio.load();
    audio.play();
  }

  // open menu for small device
  public toggleMenu() {
    const isOpen = this.authQuery.getIsOpen();
    this.authService.updateIsOpen(!isOpen);
  }

  ngOnDestroy() {
    this.authService.updateIsOpen(true);
    this.opponentUnitStore.reset();
    this.oppUnitsync ? this.oppUnitsync.unsubscribe() : false;
    this.castleVictorySub ? this.castleVictorySub.unsubscribe() : false;
    this.noUnitVictorySub ? this.noUnitVictorySub.unsubscribe() : false;
    this.finishedSub ? this.finishedSub.unsubscribe() : false;
    this.isActiveSub ? this.isActiveSub.unsubscribe() : false;
    this.dyingUnitsSub ? this.dyingUnitsSub.unsubscribe() : false;
    this.watcher ? this.watcher.unsubscribe() : false;
    this.permissionSub ? this.permissionSub.unsubscribe() : false;
  }
}
