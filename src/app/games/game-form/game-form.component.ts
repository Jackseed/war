import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { createGame } from '../+state/game.model';
import { GameService } from '../+state/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameFormComponent implements OnInit {
  submitted = false;
  game = createGame();

  constructor(
    public gameService: GameService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
  }

  public createNewGame() {
    const gameName = this.game.name;
    const gameId = this.gameService.createNewGame(gameName);
    this.router.navigate([`/games/${gameId}`]);
  }

}
