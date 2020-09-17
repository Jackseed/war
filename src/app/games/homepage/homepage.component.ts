import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { GameService, GameQuery, Game } from "../+state";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit, OnDestroy {
  private gameSub: Subscription;
  public playerGames$: Observable<Game[]>;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private gameQuery: GameQuery,
    private gameService: GameService
  ) {
    this.matIconRegistry.addSvgIcon(
      "castle",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/castle.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "shield",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/shield.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "crown",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/crown.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "sword",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/sword_home.svg"
      )
    );
    this.gameSub = this.gameService.syncCollection().subscribe();
  }

  ngOnInit(): void {
    this.playerGames$ = this.gameQuery.playerGames;
  }

  // check if there is already a game waiting for a player, if not creates it
  public playNow() {
    const instantGames = this.gameQuery.instantPlayableGames;
    if (instantGames.length > 0) {
      this.gameService.joinGame(instantGames[0].id);
    } else {
      const gameId = this.gameService.createNewGame("", true);
      this.router.navigate([`/games/${gameId}`]);
    }
  }

  ngOnDestroy() {
    this.gameSub.unsubscribe();
  }
}
