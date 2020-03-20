import { Injectable } from '@angular/core';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { PlayerStore } from './player.store';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PlayerService {

  constructor(
    private store: PlayerStore,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
  }

  connect(gameId: string) {
    const collection = this.db.collection('games').doc(gameId).collection('players');
    return syncCollection(collection, this.store);
  }


}
