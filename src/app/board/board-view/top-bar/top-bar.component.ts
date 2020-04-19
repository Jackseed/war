import { Component, OnInit } from '@angular/core';
import { GameQuery, actionsPerTurn } from 'src/app/games/+state';
import { PlayerQuery, Player } from '../../player/+state';
import { Observable } from 'rxjs';
import { I18nPluralPipe } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  public gameStatus$: Observable<'waiting' | 'unit creation' | 'placement' | 'battle' | 'finished'>;
  public player$: Observable<Player>;
  public opponent$: Observable<Player>;
  public actionsPerTurn = actionsPerTurn;
  public messageMapping: {[k: string]: string} = {'=1': 'You have 1 action left', 'other': 'You have # actions left'};

  constructor(
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
  ) { }

  ngOnInit() {
    this.gameStatus$ = this.gameQuery.gameStatus$;
    this.player$ = this.playerQuery.selectActive();
    this.opponent$ = this.playerQuery.opponent$;
  }

}
