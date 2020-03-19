import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthStore, User } from '.';
import { GameQuery } from 'src/app/games/+state';
import { syncCollection } from 'src/app/syncCollection';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private gameId = this.gameQuery.getActiveId();
  private collection = this.db.collection('games').doc(this.gameId).collection('players');
  user$: Observable<any>;

  constructor(
    private db: AngularFirestore,
    private store: AuthStore,
    private gameQuery: GameQuery,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
  // Get the auth state, then fetch the Firestore user document or return null
  this.user$ = this.afAuth.authState.pipe(
    switchMap(user => {
      // Logged in
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        // Logged out
        return of(null);
      }
    })
  );
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }

  public getUser(): Promise<any> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  async anonymousLogin() {
    const credential = await this.afAuth.auth.signInAnonymously();
    this.router.navigate(['/games']);
    return this.updateUserData(credential.user);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data = {
      id: user.uid,
    };
    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}
