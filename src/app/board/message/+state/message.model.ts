import { firestore } from "firebase/app";
import { Unit } from "../../unit/+state/unit.model";
import { guid } from "@datorama/akita";

export interface Message {
  id: number | string;
  type: "attack";
  createdAt: firestore.Timestamp;
  attackingUnit?: Unit;
  defensiveUnit?: Unit;
  isAttackerVisible?: boolean;
  isDefenserVisible?: boolean;
  casualties: number;
}

export function createMessage(params: Partial<Message>): Message {
  return {
    id: guid(),
    type: params.type,
    createdAt: params.createdAt,
    attackingUnit: params.attackingUnit,
    defensiveUnit: params.defensiveUnit,
    isAttackerVisible: params.isAttackerVisible,
    isDefenserVisible: params.isDefenserVisible,
    casualties: params.casualties
  };
}
