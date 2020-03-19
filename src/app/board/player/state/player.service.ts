import { Injectable } from '@angular/core';
import { syncCollection } from 'src/app/syncCollection';
import { GameQuery } from 'src/app/games/+state';
import { AngularFirestore } from '@angular/fire/firestore';
import { PlayerStore } from './player.store';
import { AuthQuery } from 'src/app/auth/+state';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class PlayerService {

  constructor(
    private store: PlayerStore,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private gameQuery: GameQuery,
  ) {
  }

  connect() {
    const gameId = this.gameQuery.getActiveId();
    const collection = this.db.collection('games').doc(gameId).collection('players');
    return syncCollection(collection, this.store);
  }

  /**
   * Add a player to the game
   */
  addPlayer(gameId: string, isActive: boolean) {
    const user = this.afAuth.auth.currentUser;
    console.log(user.uid);
    const collection = this.db.collection('games').doc(gameId).collection('players');
    collection.doc(user.uid).set({
      userId: user.uid,
      isActive,
    });
    this.store.setActive(user.uid);
  }

}
