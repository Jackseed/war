import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../+state/game.model';
import { GameService } from '../+state/game.service';


@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {

  public games$: Observable<Game[]>;

  constructor(
    private gameService: GameService,
  ) { }

  ngOnInit() {
    this.games$ = this.gameService.getGames();
  }

  joinGame(game) {
    this.gameService.joinGame(game);
  }

}
