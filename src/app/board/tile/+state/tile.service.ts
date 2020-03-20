import { Injectable } from '@angular/core';
import { TileStore } from './tile.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { ID } from '@datorama/akita';
import { Unit } from '../../unit/+state';

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

  markWithUnit(tileId: ID, unit: Unit) {
    console.log('updating tile ', tileId, 'with unit ', unit);
    this.store.ui.update(tileId, entity => ({ unit }));
  }

  markAsVisible(tileId: ID) {
    this.store.ui.update(tileId, entity => ({ isVisible: !entity.isVisible }));
  }

  markAsReachable(tileId: ID) {
    this.store.ui.update(tileId, entity => ({ isReachable: !entity.isReachable }));
  }

}
