import { Injectable } from "@angular/core";
import { User } from "../+state/auth.model";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";
import { Subject } from "rxjs";

@Injectable()
export class MessagingService {
  private messaging = firebase.messaging();

  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable(); // message observable to show in Angular component

  constructor(private db: AngularFirestore) {}

  // get permission to send messages
  getPermission(user: User) {
    this.messaging
      .requestPermission()
      .then(() => {
        console.log("Notification permission granted.");
        return this.messaging.getToken();
      })
      .then(token => {
        console.log(token);
        this.saveToken(user, token);
      })
      .catch(err => {
        console.log("Unable to get permission to notify.", err);
      });
  }

  // Listen for token refresh
  monitorRefresh(user: User) {
    this.messaging.onTokenRefresh(() => {
      this.messaging
        .getToken()
        .then(refreshedToken => {
          console.log("Token refreshed.");
          this.saveToken(user, refreshedToken);
        })
        .catch(err => console.log(err, "Unable to retrieve new token"));
    });
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

  // used to show message when app is open
  receiveMessages() {
    this.messaging.onMessage(payload => {
      console.log("Message received. ", payload);
      this.messageSource.next(payload);
    });
  }
}
