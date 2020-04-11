import { Component, OnInit } from '@angular/core';
import { GameQuery, GameService } from '../+state';
import { map, tap } from 'rxjs/operators';
import { PlayerQuery, Player } from 'src/app/board/player/+state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
  public gameStatus$: Observable<'unit creation' | 'placement' | 'battle' | 'finished'>;
  public players$: Observable<Player[]>;
  private playersReadyCount$: Observable<number>;

  constructor(
    private gameQuery: GameQuery,
    private gameService: GameService,
    private playerQuery: PlayerQuery,
  ) {}

  ngOnInit() {
    this.gameStatus$ = this.gameQuery.selectActive().pipe(
      map(game => game.status)
    );
    this.players$  = this.playerQuery.selectAll();
    this.playersReadyCount$ = this.gameQuery.playersReadyCount;
    // need to unsubscribe
    this.playersReadyCount$.pipe(
      tap(count => (count === 2 ? this.gameService.switchStatus() : false))
    ).subscribe();
  }

}
