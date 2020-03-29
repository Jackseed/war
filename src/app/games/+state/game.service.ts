import { Injectable } from '@angular/core';
import { GameStore, GameState } from './game.store';
import { boardCols } from './game.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CollectionService, CollectionConfig } from 'akita-ng-fire';
import { GameQuery } from './game.query';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games' })

export class GameService extends CollectionService<GameState> {

  constructor(
    store: GameStore,
    private query: GameQuery,
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    super(store);
  }

  createNewGame(name: string) {
    const id = this.db.createId();
    const status = 'unit creation';
    const user = this.afAuth.auth.currentUser;
    // Create the game
    this.collection.doc(id).set({id, name, status});
    this.addPlayer(id, user.uid, true);
    return id;
  }

  createTiles(gameId) {
    for (let i = 0; i < boardCols; i++) {
      for (let j = 0; j < boardCols; j++) {
        const tileId = j + boardCols * i;
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

  goToPlacement() {
    const game = this.query.getActive();
    //this.createTiles(game.id);
    const doc = this.db.collection('games').doc(game.id);
    doc.update({
      status: 'placement'
    });
  }

}
