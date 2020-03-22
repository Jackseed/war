import { Injectable } from '@angular/core';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { PlayerStore } from './player.store';

@Injectable({ providedIn: 'root' })
export class PlayerService {

  constructor(
    private store: PlayerStore,
    private db: AngularFirestore,
  ) {}

  connect(gameId: string) {
    const collection = this.db.collection('games').doc(gameId).collection('players');
    return syncCollection(collection, this.store);
  }

}
