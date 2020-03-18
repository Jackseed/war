import { Injectable } from '@angular/core';
import { GameStore, GameState } from './game.store';
import { syncCollection } from '../../syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { Player, createPlayer } from './game.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class GameService {
  private collection = this.db.collection('games');
  public boardSize = 3;

  constructor(
    private store: GameStore,
    private db: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth,
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }

  createNewGame(name: string) {
    const id = this.db.createId();
    const user = this.afAuth.auth.currentUser;
    const firstPlayer: Player = createPlayer({
      userId: user.uid,
      isActive: true,
    });
    // Create the game
    this.collection.doc(id).set({id, name});
    // Create the tiles:
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const tileId = j + this.boardSize * i;
        this.collection.doc(id)
          .collection('tiles').doc(tileId.toString()).set({
            x: j,
            y: i,
            color: 'grey',
            id: tileId,
            visible: false,
        });
      }
    }
    // Create first player:
    this.collection.doc(id)
      .collection('players').doc(user.uid).set(firstPlayer);

    return id;
  }
  /**
   * Add a player to the game
   */
  addPlayer(gameId: string, userId: string) {
    const secondPlayer: Player = createPlayer({
      userId,
    });
    return this.collection.doc(gameId)
      .collection('players').doc(userId).set(secondPlayer);
  }
  /**
   * Join a player to a game
   */
  async joinGame(game) {
    const user = await this.afAuth.auth.currentUser;
    this.addPlayer(game.id, user.uid);
    this.router.navigate([`/games/${game.id}`]);
  }

}
