import { RulesComponent } from "./../../../games/pages/rules/rules.component";
import { Component } from "@angular/core";
import { AuthService } from "src/app/auth/+state";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.scss"],
})
export class TopBarComponent {
  constructor(public authService: AuthService, public dialog: MatDialog) {}

  public openDialog() {
    this.dialog.open(RulesComponent);
  }
}
