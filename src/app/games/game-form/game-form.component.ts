import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from "@angular/core";
import { createGame } from "../+state/game.model";
import { GameService } from "../+state/game.service";
import { Router } from "@angular/router";
import { AngularFireAnalytics } from "@angular/fire/analytics";

@Component({
  selector: "app-game-form",
  templateUrl: "./game-form.component.html",
  styleUrls: ["./game-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class GameFormComponent implements OnInit {
  @ViewChild("gameName") gameName: ElementRef;
  game = createGame();

  constructor(
    public gameService: GameService,
    private router: Router,
    private analytics: AngularFireAnalytics
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.gameName.nativeElement.focus();
  }

  onSubmit() {}

  public createNewGame() {
    const gameName = this.game.name;
    const gameId = this.gameService.createNewGame(gameName, false);
    this.router.navigate([`/games/${gameId}`]);
    this.analytics.logEvent("create_private_game");
  }
}
