import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { GameService, GameQuery, Game } from "../+state";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  public playerGames$: Observable<Game[]>;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
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
    this.sub = this.gameService.syncCollection().subscribe();
  }

  ngOnInit(): void {
    this.playerGames$ = this.gameQuery.playerGames;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
