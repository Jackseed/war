import { Injectable } from "@angular/core";
import { MessageStore, MessageState } from "./message.store";
import {
  CollectionConfig,
  CollectionService,
  pathWithParams,
} from "akita-ng-fire";
import { GameQuery } from "src/app/games/+state";
import { Unit } from "../../unit/+state";
import * as firebase from "firebase";
import { createMessage } from "./message.model";

@Injectable({ providedIn: "root" })
@CollectionConfig({ path: "games/:gameId/messages" })
export class MessageService extends CollectionService<MessageState> {
  constructor(store: MessageStore, private gameQuery: GameQuery) {
    super(store);
  }

  get path(): string {
    const path = "path";
    const gameId = this.gameQuery.getActiveId();
    return pathWithParams(this.constructor[path], { gameId });
  }

  public addMessage(
    type: "attack",
    attackingUnit: Unit,
    defensiveUnit: Unit,
    isAttackerVisible: boolean,
    isDefenserVisible: boolean,
    casualties?: number,
    injured?: boolean
  ) {
    const collection = this.db.collection(this.currentPath);
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();
    const message = createMessage({
      type,
      createdAt,
      attackingUnit,
      defensiveUnit,
      isAttackerVisible,
      isDefenserVisible,
      casualties,
      injured,
    });
    collection.add(message);
  }
}