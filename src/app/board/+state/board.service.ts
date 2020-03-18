import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Tile } from '../tile/+state';
import { createSoldier, Unit } from '../unit/+state/unit.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private db: AngularFirestore,
  ) { }

  public getGameTiles(gameId: string): Observable<Tile[]> {
    return this.db.collection('games').doc(gameId)
      .collection('tiles', ref => ref.orderBy('id')).valueChanges();
  }

  public getGameUnits(gameId: string): Observable<Unit[]> {
    return this.db.collection('games').doc(gameId)
      .collection('units').valueChanges();
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
    this.db.collection('games').doc(gameId)
      .collection('units').doc(id).set(soldier);
  }

}

