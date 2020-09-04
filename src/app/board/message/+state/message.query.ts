import { Injectable } from "@angular/core";
import { QueryEntity, QueryConfig, Order } from "@datorama/akita";
import { MessageStore, MessageState } from "./message.store";
import { map } from "rxjs/operators";
import { PlayerQuery } from "../../player/+state";
import { firestore } from "firebase/app";

@QueryConfig({
  sortBy: "createdAt",
  sortByOrder: Order.ASC,
})
@Injectable({ providedIn: "root" })
export class MessageQuery extends QueryEntity<MessageState> {
  constructor(protected store: MessageStore, private playerQuery: PlayerQuery) {
    super(store);
  }

  public get messages$() {
    const messages$ = this.selectAll();

    let content: string;
    let isActive: boolean;
    let date: firestore.Timestamp;

    return messages$.pipe(
      map((messages) =>
        messages.map((message) => {
          const player = this.playerQuery.getActive();
          if (!message.isFightBack) {
            // active player killed them all
            if (
              message.attackingUnit.playerId === player.id &&
              message.defensiveUnit.quantity === message.casualties
            ) {
              content = `Your ${message.attackingUnit.quantity} ${message.attackingUnit.type} battalion killed ${message.defensiveUnit.quantity} ${message.defensiveUnit.type}s.`;
              isActive = true;
              date = message.createdAt;
              // active player killed some of them
            } else if (
              message.attackingUnit.playerId === player.id &&
              message.defensiveUnit.quantity !== message.casualties
            ) {
              content = `Your ${message.attackingUnit.quantity} ${message.attackingUnit.type} battalion killed
              ${message.casualties} ${message.defensiveUnit.type}s.`;
              isActive = true;
              date = message.createdAt;
              // passive player killed them all
            } else if (
              message.attackingUnit.playerId !== player.id &&
              message.defensiveUnit.quantity === message.casualties
            ) {
              content = `Opponent's ${message.attackingUnit.quantity} ${message.attackingUnit.type} battalion killed ${message.defensiveUnit.quantity} ${message.defensiveUnit.type}s.`;
              isActive = false;
              date = message.createdAt;
              // passive player killed some of them
            } else if (
              message.attackingUnit.playerId !== player.id &&
              message.defensiveUnit.quantity !== message.casualties
            ) {
              content = `Opponent's ${message.attackingUnit.quantity} ${message.attackingUnit.type} battalion killed ${message.casualties} ${message.defensiveUnit.type}s.`;
              isActive = false;
              date = message.createdAt;
            }
          } else {
            // active player killed them all
            if (
              message.attackingUnit.playerId === player.id &&
              message.defensiveUnit.quantity === message.casualties
            ) {
              content = `Your surviving ${message.attackingUnit.type}s fought back and killed opponent's ${message.defensiveUnit.type}s.`;
              isActive = true;
              date = message.createdAt;
              // active player killed some of them
            } else if (
              message.attackingUnit.playerId === player.id &&
              message.defensiveUnit.quantity !== message.casualties
            ) {
              content = `Your surviving ${message.attackingUnit.type}s fought back and killed
              ${message.defensiveUnit.quantity} ${message.defensiveUnit.type}s.`;
              isActive = true;
              date = message.createdAt;
              // passive player killed them all
            } else if (
              message.attackingUnit.playerId !== player.id &&
              message.defensiveUnit.quantity === message.casualties
            ) {
              content = `Opponent's surviving ${message.attackingUnit.type}s fought back and killed your ${message.defensiveUnit.type}s.`;
              isActive = false;
              date = message.createdAt;
              // passive player killed some of them
            } else if (
              message.attackingUnit.playerId !== player.id &&
              message.defensiveUnit.quantity !== message.casualties
            ) {
              content = `Opponent's surviving ${message.attackingUnit.type}s fought back and killed ${message.casualties} ${message.defensiveUnit.type}s.`;
              isActive = false;
              date = message.createdAt;
            }
          }
          return { content, isActive, date };
        })
      )
    );
  }
}
