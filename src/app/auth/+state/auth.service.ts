import { Injectable } from '@angular/core';
import { AuthStore, AuthState } from './auth.store';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CollectionConfig, CollectionService } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'users' })
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
    this.router.navigate(['/games']);
    console.log('you are logged in');
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.store.reset();
    console.log('logged out');
    this.router.navigate(['/welcome']);
  }
}
