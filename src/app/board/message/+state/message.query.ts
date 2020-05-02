import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { MessageStore, MessageState } from "./message.store";
import { map } from "rxjs/operators";
import { PlayerQuery } from "../../player/+state";

@Injectable({ providedIn: "root" })
export class MessageQuery extends QueryEntity<MessageState> {
  constructor(protected store: MessageStore, private playerQuery: PlayerQuery) {
    super(store);
  }

  public get messages$() {
    const messages$ = this.selectAll();
    const player = this.playerQuery.getActive();
    let title: string;
    let subtitle: string;
    let isActive: boolean;

    return messages$.pipe(
      map((messages) =>
        messages.map((message) => {
          if (message.type === "attack") {
            // active player killed them all
            if (
              message.attackingUnit.playerId === player.id &&
              message.defensiveUnit.quantity === message.casualties
            ) {
              title = `Your ${message.attackingUnit.quantity} ${message.attackingUnit.type} batalion attacked
              opponent's ${message.defensiveUnit.quantity} ${message.defensiveUnit.type} batalion.`;
              subtitle = `They killed them all.`;
              isActive = true;
            // active player killed some of them
            } else if (
              message.attackingUnit.playerId === player.id &&
              message.defensiveUnit.quantity !== message.casualties
            ) {
              title = `Your ${message.attackingUnit.quantity} ${message.attackingUnit.type} batalion attacked
              opponent's ${message.defensiveUnit.quantity} ${message.defensiveUnit.type} batalion.`;
              subtitle = `They made ${message.casualties} casualties.`;
              isActive = true;
            // passive player killed them all
            } else if (
              message.attackingUnit.playerId !== player.id &&
              message.defensiveUnit.quantity === message.casualties
            ) {
              title = `Opponent's ${message.attackingUnit.quantity} ${message.attackingUnit.type} batalion attacked
              your ${message.defensiveUnit.quantity} ${message.defensiveUnit.type} batalion.`;
              subtitle = `They killed them all.`;
              isActive = false;
            // passive player killed some of them
            } else if (
              message.attackingUnit.playerId === player.id &&
              message.defensiveUnit.quantity !== message.casualties
            ) {
              title = `Opponent's ${message.attackingUnit.quantity} ${message.attackingUnit.type} batalion attacked
              your ${message.defensiveUnit.quantity} ${message.defensiveUnit.type} batalion.`;
              subtitle = `They made ${message.casualties} casualties.`;
              isActive = false;
            }
          }
          return { title, subtitle, isActive };
        })
      )
    );
  }
}
