import { Injectable } from '@angular/core';
import { TileStore } from './tile.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameQuery } from 'src/app/games/+state';

@Injectable({ providedIn: 'root' })

export class TileService {
  private gameId = this.gameQuery.getActiveId();
  private collection = this.db.collection('games').doc(this.gameId).collection('tiles');

  constructor(
    private store: TileStore,
    private db: AngularFirestore,
    private gameQuery: GameQuery,
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }

}
