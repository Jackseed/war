import { Injectable } from '@angular/core';
import { GameStore } from './game.store';
import { syncCollection } from '../../syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { PlayerStore } from 'src/app/board/player/+state';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class GameService {
  private collection = this.db.collection('games');
  public boardSize = 3;

  constructor(
    private store: GameStore,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private playerStore: PlayerStore,
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }

  createNewGame(name: string) {
    const id = this.db.createId();
    const user = this.afAuth.auth.currentUser;
    // Create the game
    this.collection.doc(id).set({id, name});
    this.store.setActive(id);
    this.createTiles(id);
    this.addPlayer(id, user.uid, true);
    return id;
  }

  createTiles(gameId) {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const tileId = j + this.boardSize * i;
        this.db.collection('games').doc(gameId)
          .collection('tiles').doc(tileId.toString()).set({
            x: j,
            y: i,
            color: 'grey',
            id: tileId,
            visible: false,
        });
      }
    }
  }

  /**
   * Add a player to the game
   */
  addPlayer(gameId: string, userId, isActive: boolean) {
    console.log(userId);
    const collection = this.db.collection('games').doc(gameId).collection('players');
    collection.doc(userId).set({
      userId,
      isActive,
    });
    this.playerStore.setActive(userId);
  }

  /**
   * Join a player to a game
   */
  async joinGame(game) {
    const user = this.afAuth.auth.currentUser;
    this.addPlayer(game.id, user.uid, false);
    this.playerStore.setActive(user.uid);
    this.router.navigate([`/games/${game.id}`]);
  }

}
