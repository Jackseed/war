import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../+state/auth.model";
import { AuthQuery } from "../+state/auth.query";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "../+state/auth.service";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { EmailComponent } from "../login/email/email.component";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { filter, map, debounceTime } from "rxjs/operators";
import { AngularFireAnalytics } from "@angular/fire/analytics";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit, OnDestroy {
  public user$: Observable<User>;
  public user = this.query.getActive();
  public isEditing = false;
  name = new FormControl(this.user.name);
  private watcher: Subscription;
  public dialogWidth: string;
  private formCtrlSub: Subscription;

  constructor(
    private query: AuthQuery,
    private service: AuthService,
    public dialog: MatDialog,
    private mediaObserver: MediaObserver,
    private analytics: AngularFireAnalytics
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
        } else {
          this.dialogWidth = "35vw";
        }
      });
  }

  ngOnInit(): void {
    this.user$ = this.query.selectActive();
    this.user = this.query.getActive();
    this.formCtrlSub = this.name.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(newValue => this.updateName(newValue));
  }

  onSubmit() {}

  public updateName(name: string) {
    this.service.updateName(name);
    this.analytics.logEvent("update_name");
  }

  public switchEditing() {
    this.isEditing = !this.isEditing;
  }

  public openDialog() {
    this.dialog.open(EmailComponent, {
      width: this.dialogWidth,
      maxWidth: this.dialogWidth
    });
    this.analytics.logEvent("open_email_comp");
  }

  ngOnDestroy() {
    this.watcher ? this.watcher.unsubscribe() : false;
    this.formCtrlSub ? this.formCtrlSub.unsubscribe() : false;
  }
}
