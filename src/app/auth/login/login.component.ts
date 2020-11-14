import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../+state/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { filter, map } from "rxjs/operators";
import { TutoComponent } from "src/app/games/pages/tuto/tuto.component";
import { MediaObserver, MediaChange } from "@angular/flex-layout";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  private watcher: Subscription;
  public dialogWidth: string;
  public dialogHeight: string;

  constructor(
    public auth: AuthService,
    public dialog: MatDialog,
    private mediaObserver: MediaObserver
  ) {
    this.watcher = this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        if (change.mqAlias === "xs") {
          this.dialogWidth = "80vw";
          this.dialogHeight = "70vh";
        } else {
          this.dialogWidth = "30vw";
          this.dialogHeight = "65vh";
        }
      });
  }

  ngOnInit() {}

  public async logIn() {
    await this.auth.anonymousLogin();
    this.openTuto();
  }

  public openTuto() {
    this.dialog.open(TutoComponent, {
      width: this.dialogWidth,
      maxWidth: this.dialogWidth,
      height: this.dialogHeight,
      maxHeight: this.dialogHeight
    });
  }

  ngOnDestroy() {
    this.watcher ? this.watcher.unsubscribe() : false;
  }
}
