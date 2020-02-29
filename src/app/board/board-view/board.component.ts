import { Component, OnInit } from '@angular/core';
import { BoardService } from '../+state/board.service';
import { Tile, Unit, TileWithUnit, createTileWithUnit } from '../+state/board.model';
import { Observable, zip, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, tap, catchError } from 'rxjs/operators';

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
  tilesWithUnits$: Observable<TileWithUnit[]>;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.tiles$ = this.boardService.getGameTiles(this.gameId);
    this.units$ = this.boardService.getGameUnits(this.gameId);
    this.tilesWithUnits$ = this.tiles$.pipe(
      mergeMap(tiles =>
        zip(...tiles.map(
          tile => {
            if (tile.unitId !== '') {
              console.log('coucou');
              return this.boardService.getUnit$(this.gameId, tile.unitId).pipe(
                catchError(error => {
                  console.log(error);
                  return of(null);
                }),
                map(unit => createTileWithUnit(tile, unit)),
                tap(res => console.log(res))
              );
            } else {
              return;
            }
          }
        ))
      )
    );
  }

  play(i) {
    console.log(i);
  }

  createUnits() {
    this.boardService.createUnits(this.gameId);
  }

  getUnitbyId(id: string): Observable<Unit> {
    return this.units$.pipe(
        map(units => units.find(unit => unit.id === id))
    );
  }

  getUnit(id): Unit {
    let newUnit: Unit;
    this.boardService.getUnit(this.gameId, id)
      .then(unit =>  {
          newUnit = unit;
          console.log(newUnit);
      });
    console.log(newUnit);
    return newUnit;
  }
}
