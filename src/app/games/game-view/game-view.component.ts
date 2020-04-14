import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameQuery, GameService } from '../+state';
import { map, tap } from 'rxjs/operators';
import { PlayerQuery } from 'src/app/board/player/+state';
import { Observable, Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit, OnDestroy {
  public gameStatus$: Observable<'waiting' | 'unit creation' | 'placement' | 'battle' | 'finished'>;
  private playersReadyCount$: Subscription;
  private playersCount$: Subscription;

  constructor(
    private gameQuery: GameQuery,
    private gameService: GameService,
    private playerQuery: PlayerQuery,
  ) {}

  ngOnInit() {
    this.gameStatus$ = this.gameQuery.selectActive().pipe(
      map(game => game.status)
    );
    this.playersCount$ = combineLatest([this.playerQuery.selectCount(), this.gameStatus$]).pipe(
      tap(([count, gameStatus]) => (count === 2 && gameStatus === 'waiting' ? this.gameService.switchStatus('unit creation') : false))
    ).subscribe();
    this.playersReadyCount$ = this.gameQuery.playersReadyCount.pipe(
      tap(count => (count === 2 ? this.gameService.switchStatus('placement') : false))
    ).subscribe();
  }

  ngOnDestroy() {
    this.playersCount$.unsubscribe();
    this.playersReadyCount$.unsubscribe();
  }

}
