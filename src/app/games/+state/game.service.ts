import { Injectable } from '@angular/core';
import { GameStore, GameState } from './game.store';
import { boardSize } from './game.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CollectionService, CollectionConfig } from 'akita-ng-fire';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games' })

export class GameService extends CollectionService<GameState> {

  constructor(
    store: GameStore,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    super(store);
  }

  createNewGame(name: string) {
    const id = this.db.createId();
    const user = this.afAuth.auth.currentUser;
    // Create the game
    this.collection.doc(id).set({id, name});

    // this.createTiles(id);
    this.addPlayer(id, user.uid, true);
    return id;
  }

  createTiles(gameId) {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const tileId = j + boardSize * i;
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
    const collection = this.db.collection('games').doc(gameId).collection('players');
    collection.doc(userId).set({
      userId,
      isActive,
    });
  }

  /**
   * Join a player to a game
   */
  async joinGame(game) {
    const user = this.afAuth.auth.currentUser;
    this.addPlayer(game.id, user.uid, false);
    this.router.navigate([`/games/${game.id}`]);
  }


}
