import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Tile, TileQuery, TileService } from '../tile/+state';
import { Unit, UnitQuery } from '../unit/+state';
import { boardCols } from 'src/app/games/+state';
import { PlayerQuery } from '../player/+state';
import { map } from 'rxjs/operators';
import { OpponentUnitService, OpponentUnitQuery, OpponentUnitStore } from '../unit/opponent/+state';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  private oppUnitsync: Subscription;
  private tileWithUnitSub: Subscription;
  public tiles$: Observable<Tile[]>;
  public unitTileIds$: Observable<number[]>;
  public visibleOpponentUnitTileIds$: Observable<number[]>;
  public boardSize = boardCols;
  public visibleTileIds$: Observable<number[]>;
  public visibleTileIdsWithoutUnits$: Observable<number[]>;

  constructor(
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

    // get the visible tile ids
    this.visibleTileIds$ = this.tileQuery.visibleTileIds2$;

    // get unit tile ids
    this.unitTileIds$ = this.unitQuery.unitTileIds$;

    // get opponent visible unit tile ids
    this.visibleOpponentUnitTileIds$ = this.opponentUnitQuery.visibleUnits$.pipe(
      map(units =>
        units.map(({tileId}) => tileId)
      )
    );

    // Sync tiles & units
    this.tileWithUnitSub = this.unitQuery.selectAll().pipe(
      map(units =>
        units.map(unit => {
          if (unit.tileId !== undefined ) {
            this.tileService.markTileWithUnit(unit);
          }
          return unit;
        })
    )).subscribe();

  }

  play(i: number) {
    const tile: Tile = this.tileQuery.getEntity(i.toString());
    const selectedUnit: Unit = this.unitQuery.getActive();
    const player = this.playerQuery.getActive();
    // If a unit was clicked and belongs to player, turns it selected
    if (tile.unit && (tile.unit.playerId === player.id)) {
      this.tileService.removeSelected();
      this.tileService.markAsSelected(i, tile.unit);
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
    this.tileWithUnitSub.unsubscribe();
  }

}
