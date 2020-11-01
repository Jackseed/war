import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../+state/auth.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { AngularFireAuth } from "@angular/fire/auth";
import { first } from "rxjs/operators";
import {
  Plugins,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: "root"
})
export class MessagingService {
  constructor(
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  // get permission to send messages
  getPermission(user: User) {
    this.afMessaging.requestToken.subscribe(
      token => {
        this.saveToken(user, token);
      },
      error => {
        console.error(error);
      }
    );
  }

  public registerMobilePush() {
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
        this.saveActiveUserToken(token.value);
      }
    );

    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error: " + JSON.stringify(error));
    });

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        if (data.gameId) {
          console.log("Action performed: " + JSON.stringify(data.gameId));
          return this.router.navigate([`/games/${data.gameId}`]);
        }
      }
    );
  }

  // save the permission token in firestore
  private saveToken(user: User, token: string): void {
    const currentTokens = user.fcmTokens || {};

    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.db.collection("users").doc(user.id);
      const tokens = { ...currentTokens, [token]: true };
      userRef.update({ fcmTokens: tokens });
    }
  }

  public async saveActiveUserToken(token: string) {
    if (!token) return;
    const user = await this.afAuth.authState.pipe(first()).toPromise();

    const userRef = this.db.collection("users").doc(user.uid);
    const tokens = { [token]: true };
    return userRef.update({ fcmTokens: tokens });
  }
}
