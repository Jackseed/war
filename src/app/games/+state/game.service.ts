import { Injectable } from '@angular/core';
import { GameStore, GameState } from './game.store';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CollectionService, CollectionConfig } from 'akita-ng-fire';
import { GameQuery } from './game.query';
import { Game, createGame } from './game.model';
import { createPlayer } from 'src/app/board/player/+state/player.model';

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
    const user = this.afAuth.auth.currentUser;
    const playerIds = [user.uid];
    const game = createGame({id, name, playerIds});
    // Create the game
    this.collection.doc(id).set(game);
    this.addPlayer(id, user.uid, 'white', true);
    return id;
  }

  /**
   * Add a player to the game
   */
  addPlayer(gameId: string, id: string, color: 'white' | 'black', isActive: boolean) {
    const playerCollection = this.db.collection('games').doc(gameId).collection('players');
    const player = createPlayer({
      id,
      color,
      isActive,
    });
    console.log(player);
    // set the player in the game subcollection
    playerCollection.doc(id).set(player);
  }

  /**
   * Join a player to a game
   */
  async joinGame(game: Game) {
    const user = this.afAuth.auth.currentUser;

      // check if the player is already included in the game
    if (game.playerIds.includes(user.uid)) {
      this.router.navigate([`/games/${game.id}`]);

      // if not, check if the game is not full
    } else if (game.playerIds.length < 2) {
      const playerIds: string[] = game.playerIds.concat([user.uid]);

      // add the player to the game playerIds
      this.db.collection('games').doc(game.id).update({playerIds});

      // add the player to the player collection
      this.addPlayer(game.id, user.uid, 'black', false);
      this.router.navigate([`/games/${game.id}`]);

    } else {
      console.log('Game is full');
    }
  }

  /**
   * Switch active game status to 'placement'
   */
  switchStatus(status: string) {
    const game = this.query.getActive();
    const doc = this.db.collection('games').doc(game.id);
    doc.update({
      status,
      playersReady: []
    });
  }

  /**
   * Add a playerId as ready to change game status
   */
  markReady(playerId: string) {
    const game = this.query.getActive();
    const playersReady: string[] = game.playersReady.concat([playerId]);
    const doc = this.db.collection('games').doc(game.id);

    doc.update({playersReady});

    return playersReady.length;
  }

}
