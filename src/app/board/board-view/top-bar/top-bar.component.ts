import { Component, OnInit } from '@angular/core';
import { GameQuery } from 'src/app/games/+state';
import { map } from 'rxjs/operators';
import { PlayerQuery } from '../../player/+state';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  public gameStatus$ = this.gameQuery.selectActive().pipe(
    map(game => game.status)
  );
  public players$ = this.playerQuery.selectAll();

  constructor(
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
  ) { }

  ngOnInit(): void {
  }

}
