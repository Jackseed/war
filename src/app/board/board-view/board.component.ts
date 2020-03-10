import { Component, OnInit } from '@angular/core';
import { BoardService } from '../+state/board.service';
import { Tile, Unit } from '../+state/board.model';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/+state/auth.service';
import { User } from 'src/app/auth/+state/user.model';
import { GameService } from 'src/app/games/+state/game.service';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  gameId: string;
  tiles$: Observable<Tile[]>;
  units$: Observable<Unit[]>;
  unit: Unit;
  user$: Observable<User>;
  visibleTilesWithUnits$: Observable<Tile[]>;
  boardSize: number;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private afAuth: AuthService,
    private gameService: GameService,
  ) {}

  ngOnInit() {
    this.boardSize = this.gameService.boardSize;
    this.user$ = this.afAuth.user$;
    this.user$.subscribe(console.log);
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.tiles$ = this.boardService.getGameTiles(this.gameId);
    this.units$ = this.boardService.getGameUnits(this.gameId);
    this.visibleTilesWithUnits$ = combineLatest([this.tiles$, this.user$, this.units$]).pipe(
      map(([tiles, user, units]) =>
        tiles.map(tile => {
          if (tile.unitId) {
            const unit: Unit = units.find(res => res.id === tile.unitId);
            if (unit.playerId === user.uid) {
              for (let x = -unit.vision; x <= unit.vision; x++) {
                for (let y = -unit.vision; y <= unit.vision; y++) {
                  const X = tile.x + x;
                  const Y = tile.y + y;
                  if ((X < this.boardSize) && (X >= 0) && (Y < this.boardSize) && (Y >= 0)) {
                    const id = X + this.boardSize * Y;
                    tiles[id] = {
                      ...tiles[id],
                      visible: true,
                    };
                    console.log('X:', X, 'Y:', Y, 'tile ', id, ': ', tiles[id]);
                  }
                }
              }
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
              } else {
                return tile;
              }
            }
          } else {
            return tile;
          }
        })
      )
    );
    this.visibleTilesWithUnits$.subscribe(console.log);
  }

  play(i) {
    console.log(i);
  }

  createUnits(userId: string) {
    this.boardService.createUnits(this.gameId, userId);
  }

}
