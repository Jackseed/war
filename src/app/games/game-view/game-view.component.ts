import { Component, OnInit } from '@angular/core';
import { GameQuery } from '../+state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
  gameStatus$ = this.gameQuery.selectActive().pipe(
    map(game => game.status)
  );

  constructor(
    private gameQuery: GameQuery,
  ) {}

  ngOnInit() {
  }

}
