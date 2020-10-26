import { Injectable } from "@angular/core";
import { PresenceService } from "src/app/auth/presence/presence.service";
import { AuthStore, AuthState } from "./auth.store";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { CollectionConfig, CollectionService } from "akita-ng-fire";
import { createUser, User } from "./auth.model";
import { first } from "rxjs/operators";
import { AuthQuery } from "./auth.query";

@Injectable({ providedIn: "root" })
@CollectionConfig({ path: "users" })
export class AuthService extends CollectionService<AuthState> {
  constructor(
    store: AuthStore,
    private query: AuthQuery,
    private afAuth: AngularFireAuth,
    private router: Router,
    private presenceService: PresenceService
  ) {
    super(store);
  }

  async anonymousLogin() {
    await this.afAuth.auth.signInAnonymously();
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (user) {
      this.setUser(user.uid);
    }
    this.router.navigate(["/home"]);
  }

  async signOut() {
    await this.router.navigate(["/welcome"]);

    if (this.router.url.includes("welcome")) {
      await this.afAuth.auth.signOut();
      this.store.reset();
      await this.presenceService.setPresence("offline");
    }
  }

  private setUser(id: string) {
    const user = createUser({ id });
    this.db
      .collection(this.currentPath)
      .doc(id)
      .set(user);
  }

  public updateName(name: string) {
    const id = this.query.getActiveId();
    this.db
      .collection(this.currentPath)
      .doc(id)
      .update({ name });
  }

  public updateEmail(email: string) {
    const id = this.query.getActiveId();
    this.db
      .collection(this.currentPath)
      .doc(id)
      .update({ email });
  }

  public async emailSignup(email: string, password: string): Promise<string> {
    const oldUser = this.query.getActive();
    let errorMessage: string;

    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password);

      const newUser = await this.afAuth.authState.pipe(first()).toPromise();
      // merge old account and new one
      if (newUser) {
        const batch = this.db.firestore.batch();
        const newUserDoc = this.db.firestore
          .collection("users")
          .doc(newUser.uid);
        const oldUserDoc = this.db.firestore
          .collection("users")
          .doc(oldUser.id);
        const user: User = {
          id: newUser.uid,
          email: newUser.email,
          name: oldUser.name,
          gamePlayed: oldUser.gamePlayed,
          matchPlayed: oldUser.matchPlayed,
          matchWon: oldUser.matchWon,
          oldId: oldUser.id,
          fcmTokens: oldUser.fcmTokens,
        };

        batch.set(newUserDoc, user);
        batch.delete(oldUserDoc);

        batch.commit();
      }
    } catch (err) {
      errorMessage = err;
    }

    return errorMessage;
  }

  public async emailLogin(email: string, password: string): Promise<string> {
    let errorMessage: string;

    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      errorMessage = err;
    }

    return errorMessage;
  }

  public async resetPassword(email: string): Promise<string> {
    let errorMessage: string;

    try {
      await this.afAuth.auth.sendPasswordResetEmail(email);
    } catch (err) {
      errorMessage = err;
    }

    return errorMessage;
  }

  public updateIsOpen(isOpen: boolean) {
    this.store.update({
      ui: {
        isOpen
      }
    });
  }
}
