import { Component, OnInit } from '@angular/core';
import { GameQuery } from 'src/app/games/+state';
import { PlayerQuery, Player } from '../../player/+state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  public gameStatus$: Observable<'waiting' | 'unit creation' | 'placement' | 'battle' | 'finished'>;
  public player$: Observable<Player>;

  constructor(
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
  ) { }

  ngOnInit() {
    this.gameStatus$ = this.gameQuery.gameStatus$;
    this.player$ = this.playerQuery.selectActive();
  }

}
