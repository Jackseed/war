import { Injectable } from "@angular/core";
import { User } from "../+state/auth.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { BehaviorSubject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { first } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private afAuth: AngularFireAuth
  ) {}

  // get permission to send messages
  getPermission(user: User) {
    this.afMessaging.requestToken.subscribe(
      token => {
        console.log("Permission granted! Save to the server!", token);
        this.saveToken(user, token);
      },
      error => {
        console.error(error);
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

  receiveMessage() {
    this.afMessaging.messages.subscribe(payload => {
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
    });
  }
}
