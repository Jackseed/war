import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { User, AuthService } from 'src/app/auth/+state';
import { Tile, TileQuery, TileService } from '../tile/+state';
import { Unit, UnitQuery, UnitService } from '../unit/+state';
import { GameQuery, GameService } from 'src/app/games/+state';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  gameId: string = this.gameQuery.getActiveId();
  tiles$: Observable<Tile[]> = this.tileQuery.selectAll();
  units$: Observable<Unit[]> = this.unitQuery.selectAll();
  user$: Observable<User> = this.authService.user$;
  visibleTilesWithUnits$: Observable<Tile[]>;
  boardSize: number;

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private tileQuery: TileQuery,
    private tileService: TileService,
    private unitQuery: UnitQuery,
    private unitService: UnitService,
    private gameQuery: GameQuery,
  ) {}

  ngOnInit() {
    this.tileService.connect().pipe(untilDestroyed(this)).subscribe();
    this.unitService.connect().pipe(untilDestroyed(this)).subscribe();
    this.boardSize = this.gameService.boardSize;
    // TODO: remove unitId from tiles, observable loading problem
    this.visibleTilesWithUnits$ = combineLatest([this.tiles$, this.user$, this.units$]).pipe(
      map(([tiles, user, units]) =>
        tiles.map(tile => {
          if (tile.unitId) {
            const unit: Unit = units.find(res => res.id === tile.unitId);
            if (unit.playerId === user.uid) {
              this.switchAdjacentTilesParameter(tiles, tile, 'visibility', -unit.vision, unit.vision);
              return {
                ...tile,
                visible: true,
                unit,
              };
            } else {
              if (tile.visible) {
                return {
                  ...tile,
                  unit,
                };
              }
            }
          }
          return tile;
        })
      )
    );
    this.visibleTilesWithUnits$.subscribe(console.log);
  }

  async play(i: number) {
    const user = await this.authService.getUser();
    const selectedUnit$: Observable<Unit> | undefined = this.units$.pipe(
      map(units => units.find(unit => unit.isSelected === true)));
    // If a unit was clicked and belongs to player, turns it selected
    this.units$ = this.units$.pipe(
      map(units =>
        units.map(unit => {
          if ((unit.tileId === i) && (unit.playerId === user.uid)) {
            return {
              ...unit,
              isSelected: true,
            };
          } else {
            return unit;
          }
        })
      )
    );
    // If a unit was selected, turns adjacent tiles to possible moves
    if (selectedUnit$) {
      this.visibleTilesWithUnits$ = this.visibleTilesWithUnits$.pipe(
        map(tiles =>
          tiles.map(tile => {
            if (tile.unit && (tile.unit.tileId === i) && (tile.unit.playerId === user.uid)) {
              this.switchAdjacentTilesParameter(tiles, tile, 'move', -tile.unit.move, tile.unit.move);
              return tile;
            }
            return tile;
          })
        )
      );
    }
    this.visibleTilesWithUnits$.subscribe(console.log);
    this.units$.subscribe(console.log);
  }

  switchAdjacentTilesParameter(tiles: Tile[], tile: Tile, parameter: 'visibility' | 'move', start: number, end: number) {
    for (let x = start; x <= end; x++) {
      for (let y = start; y <= end; y++) {
        const X = tile.x + x;
        const Y = tile.y + y;
        // verifies that the tile is inside the board
        if ((X < this.boardSize) && (X >= 0) && (Y < this.boardSize) && (Y >= 0)) {
          const id = X + this.boardSize * Y;
          if (parameter === 'visibility') {
            tiles[id] = {
              ...tiles[id],
              visible: true,
            };
          }
          if (parameter === 'move') {
            tiles[id] = {
              ...tiles[id],
              possibleMove: true,
            };
          }
        }
      }
    }
    return tiles;
  }

  createUnits() {
    this.unitService.createUnits();
  }

  ngOnDestroy() {
  }

}