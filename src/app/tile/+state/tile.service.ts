import { Injectable } from '@angular/core';
import { TileStore } from './tile.store';
import { Tile, createTile } from './tile.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class TileService {

  moviesCollection: AngularFirestoreCollection;


  constructor(
    private db: AngularFirestore,
    private tilesStore: TileStore,
    private gameQuery: GameQuery,
  ) {
    this.fetch();
  }

  fetch() {
    const gameId = this.gameQuery.getActiveId();
    this.db.collection('games').doc(gameId)
      .collection('tiles', ref => ref.orderBy('id')).subscribe((movies: Movie[]) => {
      this.tileStore.set(movies);
    });
  }

  public getGameTiles(gameId: string): Observable<Tile[]> {
    return this.db.collection('games').doc(gameId)
      .collection('tiles', ref => ref.orderBy('id')).valueChanges();
  }

  addMovie(title: string, productionCompany: string, director: string,
    actors: string, genre: string, synopsis: string, owner: string, poster: string) {
    const id = this.afs.createId();
    const movie = { id, title, productionCompany, director, actors, genre, synopsis, owner, poster };
    this.moviesCollection.doc(id).set(movie).then(res => {
      this.tileStore.add(createMovie(movie));
    });
  }

  deleteMovie(id: string) {
    this.moviesCollection.doc(id).delete().then((res) => {
      this.tileStore.remove(id);
    });
  }

  search(searchValue) {
  return this.afs.collection('movies', ref => ref
    .orderBy('title')
    .startAt(searchValue.toLowerCase())
    .endAt(searchValue.toLowerCase() + '\uf8ff')
    .limit(10))
    .valueChanges();
  }

  updateMovie(id: string, title: string, productionCompany: string, director: string, actors: string, genre: string, synopsis: string) {
    this.moviesCollection.doc(id).update({ title, productionCompany, director, actors, genre, synopsis }).then((res) => {
      this.tileStore.update(id, { title, productionCompany, director, actors, genre, synopsis });
    });
  }



}
