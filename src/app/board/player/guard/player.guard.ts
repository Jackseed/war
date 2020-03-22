import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { PlayerService, PlayerState, PlayerStore } from '../+state';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
@CollectionGuardConfig({ awaitSync: true })
export class PlayerGuard extends CollectionGuard<PlayerState> {

  constructor(
    service: PlayerService,
    private afAuth: AngularFireAuth,
    private store: PlayerStore,
  ) {
    super(service);
  }
  // Sync and set active
  sync(next: ActivatedRouteSnapshot) {
    const user = this.afAuth.auth.currentUser;
    return this.service.syncCollection().pipe(
      tap(this.store.setActive(user.uid))
    );
  }
}
