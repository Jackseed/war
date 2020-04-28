import { Injectable } from "@angular/core";
import { MessageStore, MessageState } from "./message.store";
import {
  CollectionConfig,
  CollectionService,
  pathWithParams,
} from "akita-ng-fire";
import { GameQuery } from "src/app/games/+state";

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

  public messageFactory(
    type: "attack",
    activePlayerId: string,
    passivePlayerId: string,
    attackingUnitId: string,
    defensiveUnitId: string,
    isAttackerVisible: boolean,
    isDefenserVisible: boolean
  ) {}
}
