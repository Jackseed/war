import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Tile, TileQuery, TileService, TileStore } from '../tile/+state';
import { Unit, UnitQuery, UnitStore } from '../unit/+state';
import { GameQuery, boardCols } from 'src/app/games/+state';
import { PlayerQuery, Player } from '../player/+state';
import { map } from 'rxjs/operators';
import { OpponentUnitService, OpponentUnitQuery, OpponentUnitStore } from '../unit/opponent/+state';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  private oppUnitsub: Subscription;
  private unitsub: Subscription;
  public loading$: Observable<boolean>;
  gameId: string;
  tiles$: Observable<Tile[]>;
  units$: Observable<Unit[]>;
  players$: Observable<Player[]>;
  visibleOpponentUnits$: Observable<Unit[]>;
  visibleTiles$: Observable<Tile[]>;
  player: Player;
  boardSize = boardCols;

  constructor(
    private gameQuery: GameQuery,
    private tileStore: TileStore,
    private tileQuery: TileQuery,
    private tileService: TileService,
    private unitStore: UnitStore,
    private unitQuery: UnitQuery,
    private playerQuery: PlayerQuery,
    private opponentUnitStore: OpponentUnitStore,
    private opponentUnitService: OpponentUnitService,
    private opponentUnitQuery: OpponentUnitQuery,
  ) {}

  ngOnInit() {
    this.tileService.setTiles();
    this.players$ = this.playerQuery.selectAll();
    this.gameId = this.gameQuery.getActiveId();
    this.player = this.playerQuery.getActive();
    // turn loading to true while the unit & tille stores are loading
    this.tileStore.setLoading(true);
    this.unitStore.setLoading(true);
    this.loading$ = combineLatest([this.tileQuery.selectLoading(), this.unitQuery.selectLoading()]).pipe(
      map(([tileLoading, unitLoading]) => {
        return tileLoading && unitLoading;
      })
    );

    // Adds player units to tiles UI
    this.units$ = this.unitQuery.selectAll().pipe(
      map(units =>
        units.map(unit => {
          if (unit.tileId !== undefined ) {
            this.tileService.markTileWithUnit(unit);
          }
          return unit;
        })
    ));
    this.unitsub = this.units$.subscribe();
    this.visibleTiles$ = this.tileQuery.visibleTiles$;

    // Subscribe to the opponent units collection
    this.oppUnitsub = this.opponentUnitService.syncCollection().subscribe();

    this.visibleOpponentUnits$ = this.opponentUnitQuery.visibleUnits$;

    // Add UI states and opponent units to tiles
    this.tiles$ = this.tileQuery.combineTileWithUnits(this.tileQuery.selectAll(), this.visibleOpponentUnits$, true);
    this.tiles$.subscribe(console.log);
    // display the board
    this.tileStore.setLoading(false);
    this.unitStore.setLoading(false);
  }

  play(i: number) {
    const player: Player = this.playerQuery.getActive();
    const tile: Tile = this.tileQuery.getEntity(i.toString());
    const UItile: Tile = this.tileQuery.ui.getEntity(i);
    const selectedUnit: Unit = this.unitQuery.getActive();
    // If a unit was clicked and belongs to player, turns it selected
    if (tile.unit && (tile.unit.playerId === player.id)) {
      this.tileService.removeSelected();
      this.tileService.markAsSelected(i, tile.unit);
    } else {
      // If a unit is selected..
      if (this.unitQuery.hasActive()) {
        // and clicked on a tile reachable, the unit moves to the tile
        if (UItile.isReachable) {
          this.tileService.moveSelectedUnit(selectedUnit, i);
        }
        //
      }
    }
  }

  ngOnDestroy() {
    this.opponentUnitStore.reset();
    this.oppUnitsub.unsubscribe();
    this.unitsub.unsubscribe();
  }

}
