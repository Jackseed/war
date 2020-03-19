import { Injectable } from '@angular/core';
import { TileStore } from './tile.store';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameQuery } from 'src/app/games/+state';

@Injectable({ providedIn: 'root' })

export class TileService {
  private gameId = this.gameQuery.getActiveId();
  private collection = this.db.collection('games').doc(this.gameId).collection('tiles');
  public boardSize = 3;

  constructor(
    private store: TileStore,
    private db: AngularFirestore,
    private gameQuery: GameQuery,
  ) {
  }

  connect() {
    return syncCollection(this.collection, this.store);
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

}
