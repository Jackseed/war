import { Component, OnInit } from '@angular/core';
import { BoardService } from './board.service';
import { Tile } from './game.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  tiles: Tile[];
  gameId: string;


  constructor(
    private boardService: BoardService
  ) {}

  ngOnInit() {
    this.gameId = this.boardService.createNewGame();
    this.getTiles();
  }

  private async getTiles() {
    this.tiles = await this.boardService.getActualGameTiles(this.gameId);
  }

  play(i) {
    console.log(i);
  }
}
