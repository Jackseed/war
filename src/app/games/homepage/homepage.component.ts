import { Component, OnInit, OnDestroy } from "@angular/core";
import { TutoComponent } from "src/app/games/pages/tuto/tuto.component";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Subscription, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { GameService, GameQuery, Game } from "../+state";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { AngularFireAnalytics } from "@angular/fire/analytics";
import { MediaObserver, MediaChange } from "@angular/flex-layout";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit, OnDestroy {
  private gameSub: Subscription;
  public playerGames$: Observable<Game[]>;
  private watcher: Subscription;
  public dialogWidth: string;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private gameQuery: GameQuery,
    private gameService: GameService,
    private analytics: AngularFireAnalytics,
    public dialog: MatDialog,
    private mediaObserver: MediaObserver
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
    this.watcher = this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        if (change.mqAlias === "xs") {
          this.dialogWidth = "80vw";
        } else {
          this.dialogWidth = "35vw";
        }
      });
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

  public openTuto() {
    this.dialog.open(TutoComponent, {
      width: this.dialogWidth,
      maxWidth: this.dialogWidth
    });
  }

  ngOnDestroy() {
    this.watcher ? this.watcher.unsubscribe() : false;
    this.gameSub ? this.gameSub.unsubscribe() : false;
  }
}
