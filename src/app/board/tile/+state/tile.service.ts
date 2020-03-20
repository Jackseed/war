import { Injectable } from '@angular/core';
import { TileStore } from './tile.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { ID } from '@datorama/akita';

@Injectable({ providedIn: 'root' })

export class TileService {

  constructor(
    private store: TileStore,
    private db: AngularFirestore,
  ) {}

  connect(gameId: string) {
    const collection = this.db.collection('games').doc(gameId).collection('tiles');
    return syncCollection(collection, this.store);
  }

  markAsVisible(unitId: ID) {
    this.store.ui.update(unitId, entity => ({ isVisible: !entity.isVisible }));
  }

  markAsReachable(unitId: ID) {
    this.store.ui.update(unitId, entity => ({ isReachable: !entity.isReachable }));
  }

}
