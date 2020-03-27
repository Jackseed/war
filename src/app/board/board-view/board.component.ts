import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Tile, TileQuery, TileService } from '../tile/+state';
import { Unit, UnitQuery, UnitService } from '../unit/+state';
import { GameService, GameQuery} from 'src/app/games/+state';
import { PlayerService, PlayerQuery, Player } from '../player/+state';
import { map, switchMap } from 'rxjs/operators';
import { OpponentUnitService } from '../unit/opponent/+state';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  gameId: string;
  boardSize: number = this.gameService.boardSize;
  tiles$: Observable<Tile[]>;
  units$: Observable<Unit[]>;
  players$: Observable<Player[]> = this.playerQuery.selectAll();
  visibleTilesWithUnits$: Observable<Tile[]>;
  visibleOpponentUnits$: Observable<Unit[]>;
  visibleTiles$: Observable<Tile[]>;
  opponent: Player;
  player: Player;

  constructor(
    private gameQuery: GameQuery,
    private gameService: GameService,
    private tileQuery: TileQuery,
    private tileService: TileService,
    private unitQuery: UnitQuery,
    private unitService: UnitService,
    private playerService: PlayerService,
    private playerQuery: PlayerQuery,
    private opponentUnitService: OpponentUnitService,
  ) {}

  ngOnInit() {
    this.gameId = this.gameQuery.getActiveId();
    this.player = this.playerQuery.getActive();
    this.opponent = this.playerService.markOpponent();

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

    // Add UI states and opponent units to tiles
    this.tiles$ = this.tileQuery.selectTileWithUIandOpponentUnits();
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

  createUnits() {
    this.unitService.createUnits();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
