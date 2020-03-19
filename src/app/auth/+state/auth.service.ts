import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthStore, User } from '.';
import { GameQuery } from 'src/app/games/+state';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private collection = this.db.collection('users');

  constructor(
    private db: AngularFirestore,
    private store: AuthStore,
    private gameQuery: GameQuery,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  connect() {
    return syncCollection(this.collection, this.store);
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
