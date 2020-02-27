import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tile, createTile } from './game.model';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private db: AngularFirestore,
  ) { }


  getGameTiles(gameId: string) {
    return this.db.collection('games').doc(gameId)
    .collection('tiles').valueChanges();
  }

  public async getActualGameTiles(gameId): Promise<Tile[]> {
    const tiles: Tile[] = [];
    const tilesSnapShot = await this.db.collection('games').doc(gameId)
      .collection('tiles', ref => ref.orderBy('number'))
        .get().toPromise().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const tile = createTile(doc.data());
            tiles.push(tile);
          });
      });
    return tiles;
  }
  
  createNewGame() {
    const gameId = this.db.createId();
    // Create the game
    this.db.collection('games').doc(gameId).set({gameId});
    // Create the tiles:
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        const tileId = j + 26 * i;
        this.db.collection('games').doc(gameId)
          .collection('tiles').doc(tileId.toString()).set({
            x: j,
            y: i,
            color: 'grey',
            id: tileId,
            unitId: ''

        });
      }
    }
    return gameId;
  }
}
