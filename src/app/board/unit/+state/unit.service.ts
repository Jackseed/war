import { Injectable } from '@angular/core';
import { UnitStore } from './unit.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { createSoldier } from './unit.model';
import { ID } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class UnitService {

  constructor(
    private store: UnitStore,
    private db: AngularFirestore,
  ) {}

  connect(gameId: string, playerId: string) {
    const collection = this.db.collection('games').doc(gameId).collection('players').doc(playerId).collection('units');
    return syncCollection(collection, this.store);
  }

  public createUnits(gameId: string, playerId: string) {
    const collection = this.db.collection('games').doc(gameId).collection('players').doc(playerId).collection('units');
    const id = this.db.createId();
    const quantity = 100;
    const soldier = createSoldier({
      id,
      quantity,
    });
    collection.doc(id).set(soldier);
  }

  markAsSelected(unitId: ID) {
    this.store.ui.update(unitId, entity => ({ isSelected: !entity.isSelected }));
  }

}
