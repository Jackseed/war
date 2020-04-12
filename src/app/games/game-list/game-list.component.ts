import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService, Game, GameQuery } from '../+state';
import { AuthService } from 'src/app/auth/+state';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public games$: Observable<Game[]>;
  public playerGames$: Observable<Game[]>;
  public otherGames$: Observable<Game[]>;

  constructor(
    public auth: AuthService,
    private service: GameService,
    private query: GameQuery,
  ) { }

  ngOnInit() {
    this.sub = this.service.syncCollection().subscribe();
    this.games$ = this.query.selectAll();
    this.playerGames$ = this.query.playerGames;
    this.otherGames$ = this.query.otherGames;
  }

  joinGame(game: Game) {
    this.service.joinGame(game);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
