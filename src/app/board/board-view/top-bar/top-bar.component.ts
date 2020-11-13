// ANGULAR
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
// MATERIAL
import { MatDialog } from "@angular/material/dialog";
// FIRE
import { AngularFireAnalytics } from "@angular/fire/analytics";
// RXJS
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
// FLEX 
import { MediaObserver } from "@angular/flex-layout";
// STATES
import { GameQuery, Game } from "src/app/games/+state";
import { AuthService, AuthQuery } from "src/app/auth/+state";
// COMPONENTS
import { RulesComponent } from "./../../../games/pages/rules/rules.component";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.scss"]
})
export class TopBarComponent implements OnInit {
  public game$: Observable<Game>;
  public url$: Observable<string>;
  public isOpen: boolean;

  constructor(
    public authQuery: AuthQuery,
    public authService: AuthService,
    private gameQuery: GameQuery,
    public mediaObserver: MediaObserver,
    public dialog: MatDialog,
    private analytics: AngularFireAnalytics,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.game$ = this.gameQuery.selectActive();
    this.isOpen = this.authQuery.getIsOpen();
    this.url$ = this.route.url.pipe(map(segments => segments.join("")));
  }

  public openDialog() {
    this.dialog.open(RulesComponent);
    this.analytics.logEvent("open_rules");
  }
}
