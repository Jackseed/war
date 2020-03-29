import { Injectable } from '@angular/core';
import { GameStore, GameState } from './game.store';
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

  /**
   * Switch active game status to 'placement'
   */
  start() {
    const game = this.query.getActive();
    const doc = this.db.collection('games').doc(game.id);
    doc.update({
      status: 'placement'
    });
  }

}
