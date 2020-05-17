import { Injectable } from "@angular/core";
import { AuthStore, AuthState } from "./auth.store";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { CollectionConfig, CollectionService } from "akita-ng-fire";
import { createUser } from "./auth.model";
import { tap, first } from "rxjs/operators";

@Injectable({ providedIn: "root" })
@CollectionConfig({ path: "users" })
export class AuthService extends CollectionService<AuthState> {
  constructor(
    store: AuthStore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    super(store);
  }

  async anonymousLogin() {
    await this.afAuth.auth.signInAnonymously();
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (user) {
      this.setUser(user.uid);
    }
    this.router.navigate(["/games"]);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.store.reset();
    this.router.navigate(["/welcome"]);
  }

  private setUser(id: string) {
    const user = createUser({ id });
    this.db.collection(this.currentPath).doc(id).set(user);
  }
}
