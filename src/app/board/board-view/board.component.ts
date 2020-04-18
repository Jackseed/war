import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Tile, TileQuery, TileService } from '../tile/+state';
import { Unit, UnitQuery } from '../unit/+state';
import { boardCols, Castle, GameService } from 'src/app/games/+state';
import { map } from 'rxjs/operators';
import { OpponentUnitService, OpponentUnitQuery, OpponentUnitStore } from '../unit/opponent/+state';
import { Player, PlayerQuery } from '../player/+state';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  private oppUnitsync: Subscription;
  private victorySub: Subscription;
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


  constructor(
    private gameService: GameService,
    private tileQuery: TileQuery,
    private tileService: TileService,
    private unitQuery: UnitQuery,
    private playerQuery: PlayerQuery,
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
        unitTileIds.map(unitTileId =>
          unitTileId === this.opponentCastle.tileId ? this.gameService.switchStatus('finished') : false
        )
      )
    ).subscribe();
  }

  play(i: number) {
    const tile: Tile = this.tileQuery.getEntity(i.toString());
    const unitTileIds = this.unitQuery.unitTileIds;
    const selectedUnit: Unit = this.unitQuery.getActive();
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
  }

}
