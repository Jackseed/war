import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { createSoldier, Unit, Tile } from './board.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Player, createPlayer } from 'src/app/games/+state/game.model';


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

  /**
   * Get player from a game with userId
   */
  public async getPlayer(gameId: string, userId: string): Promise<Player> {
    let player: Player = {};
    await this.db.collection('games').doc(gameId)
      .collection('players').doc(userId)
        .get().toPromise().then(doc => {
          player = createPlayer(doc.data());
        });
    return player;
  }

  public createUnits(gameId: string, userId: string) {
    const id = this.db.createId();
    const quantity = 100;
    const soldier = createSoldier({
      id,
      quantity,
      playerId: userId,
    });
    this.db.collection('games').doc(gameId)
      .collection('units').doc(id).set(soldier);
  }

}

