import { Injectable } from '@angular/core';
import { UnitStore } from './unit.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameQuery } from '../../../games/+state';
import { createSoldier } from './unit.model';
import { PlayerQuery } from '../../player/state';

@Injectable({ providedIn: 'root' })
export class UnitService {

  constructor(
    private store: UnitStore,
    private db: AngularFirestore,
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
  ) {
  }

  connect() {
    const gameId = this.gameQuery.getActiveId();
    const playerId = this.playerQuery.getActiveId();
    const collection = this.db.collection('games').doc(gameId).collection('players').doc(playerId).collection('units');
    return syncCollection(collection, this.store);
  }


  public createUnits() {
    const gameId = this.gameQuery.getActiveId();
    const playerId = this.playerQuery.getActiveId();
    const collection = this.db.collection('games').doc(gameId).collection('players').doc(playerId).collection('units');
    const id = this.db.createId();
    const quantity = 100;
    const soldier = createSoldier({
      id,
      quantity,
      isSelected: false,
    });
    collection.doc(id).set(soldier);
  }

}
