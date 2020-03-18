import { Injectable } from '@angular/core';
import { UnitStore } from './unit.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameQuery } from '../../../games/+state';
import { createSoldier } from './unit.model';

@Injectable({ providedIn: 'root' })
export class UnitService {
  private gameId = this.gameQuery.getActiveId();
  private collection = this.db.collection('games').doc(this.gameId).collection('units');

  constructor(
    private store: UnitStore,
    private db: AngularFirestore,
    private gameQuery: GameQuery,
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }


  public createUnits(gameId: string, userId: string) {
    const id = this.db.createId();
    const quantity = 100;
    const soldier = createSoldier({
      id,
      quantity,
      playerId: userId,
      isSelected: false,
    });
    this.collection.doc(id).set(soldier);
  }

}
