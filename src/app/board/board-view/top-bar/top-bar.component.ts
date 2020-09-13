import { RulesComponent } from "./../../../games/pages/rules/rules.component";
import { Component, OnInit } from "@angular/core";
import { GameQuery, Game } from "src/app/games/+state";
import { Observable } from "rxjs";
import { AuthService, AuthQuery } from "src/app/auth/+state";
import { MediaObserver } from "@angular/flex-layout";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.scss"],
})
export class TopBarComponent implements OnInit {
  public game$: Observable<Game>;
  public isOpen: boolean;

  constructor(
    public authQuery: AuthQuery,
    public authService: AuthService,
    private gameQuery: GameQuery,
    public mediaObserver: MediaObserver,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.game$ = this.gameQuery.selectActive();
    this.isOpen = this.authQuery.getIsOpen();
  }

  public openDialog() {
    this.dialog.open(RulesComponent);
  }
}

