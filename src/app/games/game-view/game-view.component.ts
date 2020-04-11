import { Component, OnInit } from '@angular/core';
import { GameQuery } from '../+state';
import { map } from 'rxjs/operators';
import { PlayerQuery } from 'src/app/board/player/+state';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
  public gameStatus$ = this.gameQuery.selectActive().pipe(
    map(game => game.status)
  );
  public players$ = this.playerQuery.selectAll();

  constructor(
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
  ) {}

  ngOnInit() {
  }

}
