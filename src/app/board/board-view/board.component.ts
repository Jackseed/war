import { Component, OnInit } from '@angular/core';
import { BoardService } from '../+state/board.service';
import { Tile } from '../+state/board.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  tiles$: Observable<Tile[]>;
  gameId: string;


  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.tiles$ = this.boardService.getGameTiles(this.gameId);
  }

  play(i) {
    console.log(i);
  }
}
