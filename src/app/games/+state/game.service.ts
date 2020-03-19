import { Injectable } from '@angular/core';
import { GameStore } from './game.store';
import { syncCollection } from '../../syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/board/player/state';
import { TileService } from 'src/app/board/tile/+state';

@Injectable({ providedIn: 'root' })

export class GameService {
  private collection = this.db.collection('games');

  constructor(
    private store: GameStore,
    private db: AngularFirestore,
    private router: Router,
    private playerService: PlayerService,
    private tileService: TileService,
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
  }

  createNewGame(name: string) {
    const id = this.db.createId();
    // Create the game
    this.collection.doc(id).set({id, name});
    this.tileService.createTiles(id);
    this.playerService.addPlayer(true);
    return id;
  }

  /**
   * Join a player to a game
   */
  async joinGame(game) {
    this.playerService.addPlayer(false);
    this.store.setActive(game.id);
    this.router.navigate([`/games/${game.id}`]);
  }

}
