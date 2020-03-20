import { Injectable } from '@angular/core';
import { TileStore } from './tile.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameQuery } from 'src/app/games/+state';

@Injectable({ providedIn: 'root' })

export class TileService {


  constructor(
    private store: TileStore,
    private db: AngularFirestore,
    private gameQuery: GameQuery,
  ) {
  }

  connect() {
    const gameId = this.gameQuery.getActiveId();
    const collection = this.db.collection('games').doc(gameId).collection('tiles');
    return syncCollection(collection, this.store);
  }


}
