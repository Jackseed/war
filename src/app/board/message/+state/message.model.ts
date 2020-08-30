import { firestore } from "firebase/app";
import { Unit } from "../../unit/+state/unit.model";
import { guid } from "@datorama/akita";

export interface Message {
  id: number | string;
  createdAt: firestore.Timestamp;
  attackingUnit?: Unit;
  defensiveUnit?: Unit;
  isAttackerVisible?: boolean;
  isDefenserVisible?: boolean;
  isFightBack?: boolean;
  casualties?: number;
}

export function createMessage(params: Partial<Message>): Message {
  return {
    id: guid(),
    createdAt: params.createdAt,
    attackingUnit: params.attackingUnit,
    defensiveUnit: params.defensiveUnit,
    isAttackerVisible: params.isAttackerVisible,
    isDefenserVisible: params.isDefenserVisible,
    isFightBack: params.isFightBack,
    casualties: params.casualties,
  };
}
