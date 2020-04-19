import { Injectable } from '@angular/core';
import { CollectionService, CollectionConfig, pathWithParams } from 'akita-ng-fire';
import * as firebase from 'firebase/app';
import { PlayerStore, PlayerState } from './player.store';
import { PlayerQuery } from './player.query';
import { GameQuery, actionsPerTurn } from 'src/app/games/+state';

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

  public actionPlayed() {
    const player = this.query.getActive();
    const playerDoc = this.db.collection(this.currentPath).doc(player.id);
    const increment = firebase.firestore.FieldValue.increment(1);

    if (player.actionPlayed < actionsPerTurn - 1) {
      playerDoc.update({ actionPlayed: increment });
      console.log('updating increment to', player.actionPlayed + 1);
    } else {
      console.log('switching active players');
      this.switchActivePlayer();
    }
  }

  public switchActivePlayer() {
    const player = this.query.getActive();
    const opponent = this.query.opponent;
    const playerDoc = this.db.firestore.collection(this.currentPath).doc(player.id);
    const opponentDoc = this.db.firestore.collection(this.currentPath).doc(opponent.id);

    const batch = this.db.firestore.batch();

    batch.update(playerDoc, {
      isActive: false,
      actionPlayed: 0
    });

    batch.update(opponentDoc, {
      isActive: true,
      actionPlayed: 0
    });

    batch.commit();
  }

}
