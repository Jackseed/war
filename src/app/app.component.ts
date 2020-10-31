import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from "@angular/core";
import { MessagingService } from "./auth/messaging/messaging.service";
import { RouterOutlet } from "@angular/router";
import { slider } from "./animations/animations";
import { AuthQuery, User } from "./auth/+state";
import { MediaObserver } from "@angular/flex-layout";
import { Observable, Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { Game, GameQuery } from "./games/+state";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-root",
  animations: [slider],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  title = "War";
  private messageSub: Subscription;
  private permissionSub: Subscription;
  public isOpen$: Observable<boolean>;
  public user$: Observable<User>;
  public game$: Observable<Game>;
  public message;

  constructor(
    public authQuery: AuthQuery,
    public gameQuery: GameQuery,
    public mediaObserver: MediaObserver,
    public messagingService: MessagingService
  ) {}

  async ngOnInit() {
    this.isOpen$ = this.authQuery.selectIsOpen();
    this.user$ = this.authQuery.selectActive();
    this.game$ = this.gameQuery.selectActive();
    this.permissionSub = this.user$.subscribe(user => {
      if (user) {
        this.messagingService.getPermission(user);
      }
    });
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
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

  ngOnDestroy() {
    this.permissionSub.unsubscribe();
    this.messageSub.unsubscribe();
  }
}
