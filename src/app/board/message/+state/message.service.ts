import { Injectable } from "@angular/core";
import { MessageStore, MessageState } from "./message.store";
import {
  CollectionConfig,
  CollectionService,
  pathWithParams,
} from "akita-ng-fire";
import { GameQuery } from "src/app/games/+state";
import { Unit } from "../../unit/+state";
import { createMessage } from "./message.model";
import { firestore } from "firebase/app";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: "root" })
@CollectionConfig({ path: "games/:gameId/messages" })
export class MessageService extends CollectionService<MessageState> {
  constructor(
    store: MessageStore,
    private gameQuery: GameQuery,
    private snackBar: MatSnackBar
  ) {
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
    casualties?: number
  ) {
    const collection = this.db.collection(this.currentPath);
    const createdAt = firestore.Timestamp.fromDate(new Date());
    const message = createMessage({
      type,
      createdAt,
      attackingUnit,
      defensiveUnit,
      isAttackerVisible,
      isDefenserVisible,
      casualties,
    });
    collection.add(message);
  }

  public openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
      panelClass: "snackbar",
    });
  }
}
