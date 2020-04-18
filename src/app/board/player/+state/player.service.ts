import { Injectable } from '@angular/core';
import { PlayerStore, PlayerState } from './player.store';
import { CollectionService, CollectionConfig, pathWithParams } from 'akita-ng-fire';
import { GameQuery } from 'src/app/games/+state';
import { PlayerQuery } from './player.query';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players' })
export class PlayerService extends CollectionService<PlayerState> {

  constructor(
    store: PlayerStore,
    private query: PlayerQuery,
    private gameQuery: GameQuery,
  ) {
    super(store);
  }

  get path(): string {
    const path = 'path';
    const gameId = this.gameQuery.getActiveId();
    return pathWithParams(this.constructor[path], {gameId});
  }

  public setVictorious() {
    const playerId = this.query.getActiveId();
    const opponentId = this.query.opponent.id;
    const collection = this.db.firestore.collection(this.currentPath);
    const batch = this.db.firestore.batch();

    batch.update(collection.doc(playerId), {isVictorious: true});
    batch.update(collection.doc(opponentId), {isVictorious: false});

    batch.commit();
  }

}
