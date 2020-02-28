import { Component, OnInit } from '@angular/core';
import { BoardService } from '../+state/board.service';
import { Tile, Unit } from '../+state/board.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  gameId: string;
  tiles$: Observable<Tile[]>;
  units$: Observable<Unit[]>;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.tiles$ = this.boardService.getGameTiles(this.gameId);
    this.units$ = this.boardService.getGameUnits(this.gameId);
  }

  play(i) {
    console.log(i);
  }

  createUnits() {
    this.boardService.createUnits(this.gameId);
  }

  public async getUnitbyId(id): Promise<Unit> {
    return await this.boardService.getUnit(this.gameId, id);
  }
}
