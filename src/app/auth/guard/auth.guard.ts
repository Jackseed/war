import { Injectable } from '@angular/core';
import { AuthStore } from '../+state';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private store: AuthStore,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {}

  canActivate() {
    const user = this.afAuth.auth.currentUser;
    if (user) {
      console.log('welcome ', user.uid);
      this.store.setActive(user.uid);
      return true;
    } else {
      console.log('access denied');
      this.router.navigate(['/welcome']);
      return false;
    }
  }


}
