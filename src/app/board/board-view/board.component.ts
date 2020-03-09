import { Component, OnInit } from '@angular/core';
import { BoardService } from '../+state/board.service';
import { Tile, Unit, TileWithUnit } from '../+state/board.model';
import { Observable, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

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

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
  ) {}

  ngOnInit() {
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

  createUnits() {
    this.boardService.createUnits(this.gameId);
  }

}
