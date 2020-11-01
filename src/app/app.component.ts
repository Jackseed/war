import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MessagingService } from 'src/app/auth/messaging/messaging.service';
import { RouterOutlet } from "@angular/router";
import { slider } from "./animations/animations";
import { AuthQuery, User } from "./auth/+state";
import { MediaObserver } from "@angular/flex-layout";
import { Observable } from "rxjs";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-root",
  animations: [slider],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = "War";

  public isOpen$: Observable<boolean>;
  public user$: Observable<User>;

  constructor(
    public authQuery: AuthQuery,
    private messagingService: MessagingService,
    public mediaObserver: MediaObserver
  ) {}

  async ngOnInit() {
    this.isOpen$ = this.authQuery.selectIsOpen();
    this.user$ = this.authQuery.selectActive();
    // Prepare push notifications
    if (Capacitor.platform !== "web") {
      this.messagingService.registerMobilePush();
    }
  }

  public prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData["animation"]
    );
  }
}
