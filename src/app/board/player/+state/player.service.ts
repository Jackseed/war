import { Injectable } from "@angular/core";
import {
  CollectionService,
  CollectionConfig,
  pathWithParams
} from "akita-ng-fire";
import { firestore } from "firebase/app";
import { PlayerStore, PlayerState } from "./player.store";
import { PlayerQuery } from "./player.query";
import { GameQuery, actionsPerTurn } from "src/app/games/+state";
import { Player } from "./player.model";
import { OpponentUnitQuery } from "../../unit/opponent/+state/opponent-unit.query";

@Injectable({ providedIn: "root" })
@CollectionConfig({ path: "games/:gameId/players" })
export class PlayerService extends CollectionService<PlayerState> {
  constructor(
    store: PlayerStore,
    private query: PlayerQuery,
    private gameQuery: GameQuery,
    private opponentUnitQuery: OpponentUnitQuery
  ) {
    super(store);
  }

  get path(): string {
    const path = "path";
    const gameId = this.gameQuery.getActiveId();
    if (gameId) {
      return pathWithParams(this.constructor[path], { gameId });
    }
  }

  public setVictorious(winner: Player, loser: Player) {
    const collection = this.db.firestore.collection(this.currentPath);
    const batch = this.db.firestore.batch();
    const increment = firestore.FieldValue.increment(1);

    batch.update(collection.doc(winner.id), {
      isVictorious: true,
      wins: increment
    });
    batch.update(this.db.firestore.collection("users").doc(winner.id), {
      gamePlayed: firestore.FieldValue.arrayUnion(this.gameQuery.getActiveId()),
      matchPlayed: increment,
      matchWon: increment
    });

    batch.update(collection.doc(loser.id), { isVictorious: false });
    batch.update(this.db.firestore.collection("users").doc(loser.id), {
      gamePlayed: firestore.FieldValue.arrayUnion(this.gameQuery.getActiveId()),
      matchPlayed: increment
    });

    batch.commit();
  }

  public actionPlayed() {
    const player = this.query.getActive();
    const playerDoc = this.db.collection(this.currentPath).doc(player.id);
    const increment = firestore.FieldValue.increment(1);

    if (player.actionCount < actionsPerTurn - 1) {
      playerDoc.update({ actionCount: increment });
    } else {
      this.switchActivePlayer();
    }
  }

  public switchActivePlayer() {
    const player = this.query.getActive();
    const opponent = this.query.opponent;
    const gameId = this.gameQuery.getActiveId();
    const oppTiredUnits = this.opponentUnitQuery.tiredUnits;
    const playerDoc = this.db.firestore
      .collection(this.currentPath)
      .doc(player.id);
    const opponentDoc = this.db.firestore
      .collection(this.currentPath)
      .doc(opponent.id);
    const gameDoc = this.db.firestore.collection("games").doc(gameId);
    const increment = firestore.FieldValue.increment(1);

    const batch = this.db.firestore.batch();

    batch.update(playerDoc, {
      isActive: false,
      actionCount: 0
    });

    batch.update(opponentDoc, {
      isActive: true,
      actionCount: 0
    });

    batch.update(gameDoc, { turnCount: increment });

    for (const unit of oppTiredUnits) {
      const unitDoc = opponentDoc.collection("units").doc(unit.id);
      batch.update(unitDoc, { stamina: increment });
    }

    batch.commit();
  }
}
