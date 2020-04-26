import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Tile, TileQuery, TileService } from '../tile/+state';
import { Unit, UnitQuery, UnitService } from '../unit/+state';
import { boardCols, Castle, actionsPerTurn, GameService, GameQuery } from 'src/app/games/+state';
import { map } from 'rxjs/operators';
import { OpponentUnitService, OpponentUnitQuery, OpponentUnitStore } from '../unit/opponent/+state';
import { Player, PlayerQuery, PlayerService } from '../player/+state';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  private oppUnitsync: Subscription;
  private castleVictorySub: Subscription;
  private noUnitVictorySub: Subscription;
  private finishedSub: Subscription;
  public boardSize = boardCols;
  public player: Player;
  public opponentPlayer: Player;
  public castle: Castle;
  public opponentCastle: Castle;
  public castleIds: number[];
  public tiles$: Observable<Tile[]>;
  public unitTileIds$: Observable<number[]>;
  public visibleOpponentUnitTileIds$: Observable<number[]>;
  public visibleTileIds$: Observable<number[]>;
  public gameStatus$: Observable<'waiting' | 'unit creation' | 'placement' | 'battle' | 'finished'>;


  constructor(
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
  ) {}

  ngOnInit() {
    this.tileService.setTiles();
    this.oppUnitsync = this.opponentUnitService.syncCollection().subscribe();
    this.tiles$ = this.tileQuery.selectAll();
    this.player = this.playerQuery.getActive();
    this.opponentPlayer = this.playerQuery.opponent;
    this.castle = Castle(this.player.color);
    this.opponentCastle = Castle(this.opponentPlayer.color);
    this.castleIds = [this.castle.tileId, this.opponentCastle.tileId];
    this.gameStatus$ = this.gameQuery.gameStatus$;

    // get the visible tile ids, except during placement
    this.visibleTileIds$ = combineLatest([this.gameStatus$, this.tileQuery.visibleTileIds$]).pipe(
      map(([status, visibleTiles]) => {
        if (status === 'placement') {
          return [];
        } else {
          return visibleTiles;
        }
      })
    );

    // get unit tile ids
    this.unitTileIds$ = this.unitQuery.unitTileIds$;

    // get opponent visible unit tile ids
    this.visibleOpponentUnitTileIds$ = this.opponentUnitQuery.visibleUnits$.pipe(
      map(units =>
        units.map(({tileId}) => tileId)
      )
    );

    // check if a player unit is on the opponent castle, if so stop the game
    this.castleVictorySub = this.unitTileIds$.pipe(
      map(unitTileIds =>
        unitTileIds.map(unitTileId => {
          if (unitTileId === this.opponentCastle.tileId) {
            this.gameService.switchStatus('finished');
            this.playerService.setVictorious(this.player, this.opponentPlayer);
          }
        })
      )
    ).subscribe();

    // check if a player has no unit anymore
    this.noUnitVictorySub = combineLatest([this.unitQuery.selectCount(unit => unit.tileId !== null), this.unitQuery.selectLoading(),
      this.opponentUnitQuery.selectCount(unit => unit.tileId !== null), this.opponentUnitQuery.selectLoading(), this.gameStatus$]).pipe(
        map(([unitCount, unitLoading, oppUnitCount, oppUnitLoading, gameStatus]) => {
          if (gameStatus === 'battle' && !unitLoading && !oppUnitLoading) {
            if (unitCount === 0) {
              this.gameService.switchStatus('finished');
              console.log('your army is destroyed, game over');
              this.playerService.setVictorious(this.opponentPlayer, this.player);
            } else if (oppUnitCount === 0) {
              this.gameService.switchStatus('finished');
              console.log('you crushed him, congratz');
              this.playerService.setVictorious(this.player, this.opponentPlayer);
            }
          }
        })
    ).subscribe();

    // when the game is finished, turn all the tiles & units visible
    this.finishedSub = this.gameStatus$.pipe(
      map(gameStatus => {
        if (gameStatus === 'finished') {
          this.visibleTileIds$ = this.tileQuery.tileIds$;
          this.visibleOpponentUnitTileIds$ = this.opponentUnitQuery.unitTileIds$;
        }
      })
    ).subscribe();
  }

  play(i: number) {
    const tile = this.tileQuery.getEntity(i.toString());
    const unitTileIds = this.unitQuery.unitTileIds;
    const selectedUnit = this.unitQuery.getActive();
    const game = this.gameQuery.getActive();
    const player = this.playerQuery.getActive();

    if (game.status === 'placement') {
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
        this.tileService.moveSelectedUnit(selectedUnit, i);
        this.tileService.removeSelected();
      }
    }

    if (game.status === 'battle') {
      // Check if the player is active & has not made too many actions
      if (player.isActive && (player.actionCount < actionsPerTurn)) {
        // If a unit was clicked and belongs to player, turns it selected
        if (unitTileIds.includes(i)) {

          this.tileService.removeReachable();
          this.tileService.removeSelected();
          this.tileService.removeInRangeTiles();

          this.tileService.markAsSelected(i);
          this.tileService.markAdjacentTilesReachable(i);
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

          } else if (tile.isReachable) {
            // and clicked on a tile reachable, the unit moves to the tile
            this.tileService.moveSelectedUnit(selectedUnit, i);

            this.tileService.removeReachable();
            this.tileService.removeSelected();
            this.tileService.removeInRangeTiles();
            // increment action count and switch active player if needed
            this.playerService.actionPlayed();
          }
        }
      } else {
        console.log('not your turn');
      }
    }

    // Check if the game is ongoing
    if (game.status === 'finished') {
      console.log('game is over');
    }
  }

  public getUnitByTileId(tileId: number): Unit {
    return this.unitQuery.getUnitByTileId(tileId);
  }

  public getOpponentUnitByTileId(tileId: number): Unit {
    return this.opponentUnitQuery.getUnitByTileId(tileId);
  }

  ngOnDestroy() {
    this.opponentUnitStore.reset();
    this.oppUnitsync.unsubscribe();
    this.castleVictorySub.unsubscribe();
    this.noUnitVictorySub.unsubscribe();
    this.finishedSub.unsubscribe();
  }

}
