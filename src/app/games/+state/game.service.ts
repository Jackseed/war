import { Injectable } from '@angular/core';
import { GameStore, GameState } from './game.store';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CollectionService, CollectionConfig } from 'akita-ng-fire';
import { GameQuery } from './game.query';
import { Game } from './game.model';

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
    const playerIds = [user.uid];
    // Create the game
    this.collection.doc(id).set({id, name, status, playerIds});
    this.addPlayer(id, user.uid, true);
    return id;
  }

  /**
   * Add a player to the game
   */
  addPlayer(gameId: string, userId, isActive: boolean) {
    const playerCollection = this.db.collection('games').doc(gameId).collection('players');
    // set the player in the game subcollection
    playerCollection.doc(userId).set({
      userId,
      isActive,
    });
  }

  /**
   * Join a player to a game
   */
  async joinGame(game: Game) {
    const user = this.afAuth.auth.currentUser;

    if (game.playerIds.includes(user.uid)) {
      this.router.navigate([`/games/${game.id}`]);
    } else if (game.playerIds.length < 2) {
      const playerIds: string[] = game.playerIds.concat([user.uid]);
      // add the player to the game playerIds
      this.db.collection('games').doc(game.id).update({playerIds});
      // add the player to the player collection
      this.addPlayer(game.id, user.uid, false);
      this.router.navigate([`/games/${game.id}`]);
    } else {
      console.log('Game is full');
    }
  }

  /**
   * Switch active game status to 'placement'
   */
  switchStatus(status) {
    const game = this.query.getActive();
    const doc = this.db.collection('games').doc(game.id);
    doc.update({
      status
    });
  }

}
