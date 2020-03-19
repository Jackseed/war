import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService, Game, GameQuery } from '../+state';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthService } from 'src/app/auth/+state';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit, OnDestroy {
  public games$: Observable<Game[]> = this.gameQuery.selectAll();

  constructor(
    private gameService: GameService,
    private gameQuery: GameQuery,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.gameService.connect().pipe(untilDestroyed(this)).subscribe();
    this.authService.connect().pipe(untilDestroyed(this)).subscribe();
  }

  joinGame(game) {
    this.gameService.joinGame(game);
  }

  ngOnDestroy() {
  }
}
