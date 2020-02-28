import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { createSoldier } from './board.model';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private db: AngularFirestore,
  ) { }


  getGameTiles(gameId: string) {
    return this.db.collection('games').doc(gameId)
    .collection('tiles').valueChanges();
  }

  createUnits(gameId) {
    const id = this.db.createId();
    const quantity = 100;
    const soldier = createSoldier({
      id,
      quantity,
    });
    this.db.collection('games').doc(gameId)
      .collection('units').doc(id).set(soldier);
  }
}
