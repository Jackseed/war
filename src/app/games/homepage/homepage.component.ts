import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { GameService, GameQuery, Game } from "../+state";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { AngularFireAnalytics } from "@angular/fire/analytics";

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
    private gameService: GameService,
    private analytics: AngularFireAnalytics
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
  public async playNow() {
    const instantGame = await this.gameQuery.instantPlayableGame;

    if (instantGame.length > 0) {
      this.gameService.joinGame(instantGame[0].id);
    } else {
      const gameId = this.gameService.createNewGame("", true);
      this.router.navigate([`/games/${gameId}`]);
      this.analytics.logEvent("play_now");
    }
  }

  ngOnDestroy() {
    this.gameSub ? this.gameSub.unsubscribe() : false;
  }
}
