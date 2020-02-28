import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tile, createTile } from './board.model';


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
}
