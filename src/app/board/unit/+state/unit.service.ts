import { Injectable } from '@angular/core';
import { UnitStore } from './unit.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameQuery } from '../../../games/+state';
import { createSoldier } from './unit.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UnitService {
  private user = this.afAuth.auth.currentUser;
  private gameId = this.gameQuery.getActiveId();
  private collection = this.db.collection('games').doc(this.gameId).collection('players').doc(this.user.uid).collection('units');

  constructor(
    private store: UnitStore,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private gameQuery: GameQuery,
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }


  public createUnits() {
    const id = this.db.createId();
    const quantity = 100;
    const soldier = createSoldier({
      id,
      quantity,
      isSelected: false,
    });
    this.collection.doc(id).set(soldier);
  }

}
