import { Injectable } from '@angular/core';
import { GameStore } from './game.store';
import { syncCollection } from '../../syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { PlayerService } from 'src/app/board/player/+state';
import { TileService } from 'src/app/board/tile/+state';
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
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }

  createNewGame(name: string) {
    const id = this.db.createId();
    // Create the game
    this.collection.doc(id).set({id, name});
    this.store.setActive(id);
    this.createTiles(id);
    this.addPlayer(id, true);
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
  addPlayer(gameId: string, isActive: boolean) {
    const user = this.afAuth.auth.currentUser;
    console.log(user.uid);
    const collection = this.db.collection('games').doc(gameId).collection('players');
    collection.doc(user.uid).set({
      userId: user.uid,
      isActive,
    });
    this.store.setActive(user.uid);
  }

  /**
   * Join a player to a game
   */
  async joinGame(game) {
    this.addPlayer(game.id, false);
    this.router.navigate([`/games/${game.id}`]);
  }

}
