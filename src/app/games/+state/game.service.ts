import { Injectable } from "@angular/core";
import { GameStore, GameState } from "./game.store";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { CollectionService, CollectionConfig } from "akita-ng-fire";
import { GameQuery } from "./game.query";
import { createGame } from "./game.model";
import { createPlayer } from "src/app/board/player/+state/player.model";
import { firestore } from "firebase/app";

@Injectable({ providedIn: "root" })
@CollectionConfig({ path: "games" })
export class GameService extends CollectionService<GameState> {
  constructor(
    store: GameStore,
    private query: GameQuery,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    super(store);
  }

  createNewGame(name: string, isInstant: boolean) {
    const id = this.db.createId();
    const user = this.afAuth.auth.currentUser;
    const playerIds = [user.uid];
    const game = createGame({ id, name, playerIds, isInstant });
    // Create the game
    this.collection.doc(id).set(game);
    this.addPlayer(id, user.uid, "white", true);
    return id;
  }

  deleteGame(gameId: string) {
    console.log("deleting ", gameId);
    this.collection.doc(gameId).delete();
  }

  /**
   * Add a player to the game
   */
  addPlayer(
    gameId: string,
    id: string,
    color: "white" | "black",
    isActive: boolean
  ) {
    const playerCollection = this.db
      .collection("games")
      .doc(gameId)
      .collection("players");
    const player = createPlayer({
      id,
      color,
      isActive
    });
    // set the player in the game subcollection
    playerCollection.doc(id).set(player);
  }

  removePlayer(playerId: string) {
    const game = this.query.getActive();
    const gameDoc = this.db.firestore.collection("games").doc(game.id);
    const playerDoc = gameDoc.collection("players").doc(playerId);
    const batch = this.db.firestore.batch();

    batch.delete(playerDoc);
    batch.update(gameDoc, {
      playerIds: firestore.FieldValue.arrayRemove(playerId)
    });

    batch.commit();
  }

  /**
   * Join a player to a game
   */
  async joinGame(gameId: string) {
    const user = this.afAuth.auth.currentUser;
    const game = this.query.getEntity(gameId);

    // check if the player is already included in the game
    if (game.playerIds.includes(user.uid)) {
      this.router.navigate([`/games/${game.id}`]);

      // if not, check if the game is not full
    } else if (game.playerIds.length < 2) {
      const playerIds: string[] = game.playerIds.concat([user.uid]);

      // add the player to the game playerIds
      this.db
        .collection("games")
        .doc(game.id)
        .update({ playerIds });

      // add the player to the player collection
      this.addPlayer(game.id, user.uid, "black", false);
      this.router.navigate([`/games/${game.id}`]);
    } else {
      console.log("game is full");
    }
  }

  /**
   * Switch active game status to 'placement'
   */
  switchStatus(status: string) {
    const game = this.query.getActive();
    const doc = this.db.collection("games").doc(game.id);
    doc.update({
      status,
      playersReady: []
    });
  }

  /**
   * Add a playerId as ready to change game status
   */
  markReady(playerId: string) {
    const game = this.query.getActive();
    const playersReady: string[] = game.playersReady.concat([playerId]);
    const doc = this.db.collection("games").doc(game.id);

    doc.update({ playersReady });
  }

  cancelReady(playerId: string) {
    const game = this.query.getActive();
    const doc = this.db.collection("games").doc(game.id);

    doc.update({
      playersReady: firestore.FieldValue.arrayRemove(playerId)
    });
  }

  resetReady() {
    const game = this.query.getActive();
    const doc = this.db.collection("games").doc(game.id);

    doc.update({
      playersReady: []
    });
  }

  rematch() {
    const game = this.query.getActive();
    const doc = this.db.collection("games").doc(game.id);
    const increment = firestore.FieldValue.increment(1);

    if (game.status === "finished") {
      doc.update({
        playersRematch: [],
        matchs: increment
      });
    }
    this.switchStatus("unit creation");
  }

  public isRematching(playerId: string) {
    const game = this.query.getActive();
    const playersRematch: string[] = game.playersRematch.concat([playerId]);
    const doc = this.db.collection("games").doc(game.id);

    doc.update({ playersRematch });
  }

  public markClosed(): void {
    const game = this.query.getActive();
    const doc = this.db.collection("games").doc(game.id);
    doc.update({ isClosed: true });
  }
}
