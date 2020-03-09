import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game, createGame, createPlayer, Player } from './game.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class GameService {

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth,
  ) { }

  createNewGame(name: string) {
    const id = this.db.createId();
    const user = this.afAuth.auth.currentUser;
    const firstPlayer: Player = createPlayer({
      userId: user.uid,
      isActive: true,
    });
    // Create the game
    this.db.collection('games').doc(id).set({id, name});
    // Create the tiles:
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        const tileId = j + 26 * i;
        this.db.collection('games').doc(id)
          .collection('tiles').doc(tileId.toString()).set({
            x: j,
            y: i,
            color: 'grey',
            id: tileId,
        });
      }
    }
    // Create first player:
    this.db.collection('games').doc(id)
      .collection('players').doc(user.uid).set(firstPlayer);

    return id;
  }

  /**
   * Get the game list
   */
  getGames() {
    return this.db.collection('games').valueChanges();
  }

  /**
   * Get a game by id
   */

  public async getGame(id: string): Promise<Game> {
    const gameSnapShot = await this.db
    .collection('games').doc(id)
      .get().toPromise();
    return createGame(gameSnapShot.data());
  }
  /**
   * Add a player to the game
   */
  addPlayer(gameId: string, userId: string) {
    const secondPlayer: Player = createPlayer({
      userId,
    });
    return this.db.collection('games').doc(gameId)
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
