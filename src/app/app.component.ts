import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";
import { MessagingService } from "./auth/messaging/messaging.service";
import { RouterOutlet } from "@angular/router";
import { slider } from "./animations/animations";
import { AuthQuery, User } from "./auth/+state";
import { MediaObserver } from "@angular/flex-layout";
import { Observable, Subscription } from "rxjs";
import { Game, GameQuery } from "./games/+state";
import { AngularFireMessaging } from "@angular/fire/messaging";

const { PushNotifications } = Plugins;

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
    public messagingService: MessagingService,
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

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        alert("Push registration success, token: " + token.value);
        this.messagingService.saveActiveUserToken(token.value);
      }
    );

    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        alert("Push received: " + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        alert("Push action performed: " + JSON.stringify(notification));
      }
    );
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
