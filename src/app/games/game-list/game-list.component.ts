import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService, Game, GameQuery } from '../+state';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public games$: Observable<Game[]>;

  constructor(
    private service: GameService,
    private query: GameQuery,
  ) { }

  ngOnInit() {
    this.sub = this.service.syncCollection().subscribe();
    this.games$ = this.query.selectAll();
  }

  joinGame(game) {
    this.service.joinGame(game);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
