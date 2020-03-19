import { Injectable } from '@angular/core';
import { syncCollection } from 'src/app/syncCollection';
import { GameQuery } from 'src/app/games/+state';
import { AngularFirestore } from '@angular/fire/firestore';
import { PlayerStore } from '.';
import { AuthQuery } from 'src/app/auth/+state';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private gameId = this.gameQuery.getActiveId();
  private userId = this.authQuery.userId;
  private collection = this.db.collection('games').doc(this.gameId).collection('players');

  constructor(
    private store: PlayerStore,
    private db: AngularFirestore,
    private authQuery: AuthQuery,
    private gameQuery: GameQuery,
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }

  /**
   * Add a player to the game
   */
  addPlayer(isActive: boolean) {
    this.collection.doc(this.userId).set({
      userId: this.userId,
      isActive,
    });
    this.store.setActive(this.userId);
  }

}
