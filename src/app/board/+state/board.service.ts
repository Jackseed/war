import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { createSoldier, Unit, Tile } from './board.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


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

  public createUnits(gameId) {
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

