import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Tile, TileQuery, TileService } from '../tile/+state';
import { Unit, UnitQuery } from '../unit/+state';
import { boardCols, Castle, GameService, GameQuery } from 'src/app/games/+state';
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
  private victorySub: Subscription;
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

    // get the visible tile ids
    this.visibleTileIds$ = this.tileQuery.visibleTileIds$;

    // get unit tile ids
    this.unitTileIds$ = this.unitQuery.unitTileIds$;

    // get opponent visible unit tile ids
    this.visibleOpponentUnitTileIds$ = this.opponentUnitQuery.visibleUnits$.pipe(
      map(units =>
        units.map(({tileId}) => tileId)
      )
    );

    this.victorySub = this.unitTileIds$.pipe(
      map(unitTileIds =>
        unitTileIds.map(unitTileId => {
          if (unitTileId === this.opponentCastle.tileId) {
            this.gameService.switchStatus('finished');
            this.playerService.setVictorious();
          }
        })
      )
    ).subscribe();

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

    // Check if the game is ongoing
    if (game.status !== 'finished') {
      // If a unit was clicked and belongs to player, turns it selected
      if (unitTileIds.includes(i)) {
        const unit = this.getUnitbyTileId(i);
        this.tileService.removeSelected();
        this.tileService.markAsSelected(i, unit);
      } else {
        // If a unit is selected..
        if (this.unitQuery.hasActive()) {
          // and clicked on a tile reachable, the unit moves to the tile
          if (tile.isReachable) {
            this.tileService.moveSelectedUnit(selectedUnit, i);
          }
        }
      }
    } else {
      console.log('game is over');
    }
  }

  getUnitbyTileId(tileId: number): Unit {
    return this.unitQuery.getUnitbyTileId(tileId);
  }

  getOpponentUnitbyTileId(tileId: number): Unit {
    return this.opponentUnitQuery.getUnitbyTileId(tileId);
  }

  ngOnDestroy() {
    this.opponentUnitStore.reset();
    this.oppUnitsync.unsubscribe();
    this.victorySub.unsubscribe();
    this.finishedSub.unsubscribe();
  }

}
