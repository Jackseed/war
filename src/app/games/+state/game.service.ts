import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game, createGame } from './game.model';

@Injectable()
export class GameService {

  constructor(
    private db: AngularFirestore,
    private router: Router,
  ) { }

  createNewGame(name: string) {
    const id = this.db.createId();
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
   * Join a player to a game
   */
  async joinGame(game) {
    this.router.navigate([`/games/${game.id}`]);
  }

}
