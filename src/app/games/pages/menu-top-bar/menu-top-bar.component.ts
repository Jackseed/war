import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/+state";
import { GameQuery } from "../../+state";
import { Observable } from "rxjs";

@Component({
  selector: "app-menu-top-bar",
  templateUrl: "./menu-top-bar.component.html",
  styleUrls: ["./menu-top-bar.component.scss"],
})
export class MenuTopBarComponent implements OnInit {
  public gameStatus$: Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  >;
  constructor(public auth: AuthService, private gameQuery: GameQuery) {}

  ngOnInit(): void {
    this.gameStatus$ = this.gameQuery.gameStatus$;
  }
}
