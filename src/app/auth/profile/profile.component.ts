import { Component, OnInit } from "@angular/core";
import { User } from "../+state/auth.model";
import { AuthQuery } from "../+state/auth.query";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "../+state/auth.service";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { EmailComponent } from "../login/email/email.component";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public user$: Observable<User>;
  public user = this.query.getActive();
  public isEditing = false;
  name = new FormControl(this.user.name);
  private watcher: Subscription;
  private activeMediaQuery: string;
  public dialogWidth: string;

  constructor(
    private query: AuthQuery,
    private service: AuthService,
    public dialog: MatDialog,
    private mediaObserver: MediaObserver
  ) {
    this.watcher = mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        this.activeMediaQuery = change
          ? `'${change.mqAlias}' = (${change.mediaQuery})`
          : "";
        if (change.mqAlias === "xs") {
          console.log("xs ou sm");
          this.dialogWidth = "80vw";
        } else {
          console.log("other");
          this.dialogWidth = "35vw";
        }
      });
  }

  ngOnInit(): void {
    this.user$ = this.query.selectActive();
    this.user = this.query.getActive();
  }

  onSubmit() {}

  public updateName(name: string) {
    this.service.updateName(name);
  }

  public switchEditing() {
    this.isEditing = !this.isEditing;
  }

  public openDialog() {
    this.dialog.open(EmailComponent, {
      width: this.dialogWidth,
      maxWidth: this.dialogWidth,
    });
  }
}
