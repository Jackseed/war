import { Component, OnInit } from '@angular/core';
import { BoardService } from '../+state/board.service';
import { Tile, Unit } from '../+state/board.model';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/+state/auth.service';
import { User } from 'src/app/auth/+state/user.model';


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
  tilesWithUnits$: Observable<Tile[]>;
  user$: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private afAuth: AuthService,
  ) {}

  ngOnInit() {
    this.user$ = this.afAuth.user$;
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.tiles$ = this.boardService.getGameTiles(this.gameId);
    this.units$ = this.boardService.getGameUnits(this.gameId);
    this.tilesWithUnits$ = combineLatest([this.tiles$, this.units$]).pipe(
      map(([tiles, units]) =>
        tiles.map(tile => {
          if (tile.unitId) {
            return {
              ...tile,
              unit: units.find(unit => unit.id === tile.unitId)
            };
          } else {
            return tile;
          }
        })
      )
    );
    this.tilesWithUnits$.subscribe(console.log);
  }

  play(i) {
    console.log(i);
  }

  createUnits(userId: string) {
    this.boardService.createUnits(this.gameId, userId);
  }

}
