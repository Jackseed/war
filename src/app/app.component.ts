import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { slider } from "./animations/animations";
import { AuthQuery, User } from "./auth/+state";
import { MediaObserver } from "@angular/flex-layout";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  animations: [slider],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = "War";
  public isOpen$: Observable<boolean>;
  public user$: Observable<User>;

  constructor(
    public authQuery: AuthQuery,
    public mediaObserver: MediaObserver
  ) {}

  ngOnInit() {
    this.isOpen$ = this.authQuery.selectIsOpen();
    this.user$ = this.authQuery.selectActive();
  }

  public prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      // tslint:disable-next-line: no-string-literal
      outlet.activatedRouteData["animation"]
    );
  }
}
