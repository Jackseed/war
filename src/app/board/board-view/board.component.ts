import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription, combineLatest } from 'rxjs';
import { Tile, TileQuery, TileService, TileStore } from '../tile/+state';
import { Unit, UnitQuery, UnitStore } from '../unit/+state';
import { GameQuery, boardCols } from 'src/app/games/+state';
import { PlayerQuery, Player } from '../player/+state';
import { map, switchMap } from 'rxjs/operators';
import { OpponentUnitService, OpponentUnitQuery, OpponentUnitStore } from '../unit/opponent/+state';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public loading$: Observable<boolean>;
  gameId: string;
  tiles$: Observable<Tile[]>;
  units$: Observable<Unit[]>;
  players$: Observable<Player[]> = this.playerQuery.selectAll();
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
    this.visibleTiles$ = this.tileQuery.visibleTiles$;

    // Subscribe to the opponent units collection
    this.sub = this.visibleTiles$.pipe(
      map(visibleTiles =>
        visibleTiles.map(({id}) => id)),
      switchMap(visibleTileIds => {
        if (visibleTileIds.length > 0) {
          return this.opponentUnitService.syncCollection(ref => ref.where('tileId', 'in', visibleTileIds));
        } else {
          return of([{}]);
        }
      })
    ).subscribe();

    this.visibleOpponentUnits$ = this.opponentUnitQuery.selectAll();

    // Add UI states and opponent units to tiles
    this.tiles$ = this.tileQuery.combineTileWithUIandUnits(this.tileQuery.selectAll(), this.visibleOpponentUnits$, true);

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
    this.sub.unsubscribe();
  }

}
