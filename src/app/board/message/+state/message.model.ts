import * as firebase from 'firebase/app';

export interface Message {
  id: number | string;
  type: 'attack';
  activePlayerId: string;
  passivePlayerId?: string;
  timestamp: firebase.firestore.Timestamp;
  attackingUnitId?: string;
  defensiveUnitId?: string;
  isAttackerVisible?: boolean;
  isDefenserVisible?: boolean;
}

export function createMessage(params: Partial<Message>): Message {
  return {
    id: params.id,
    type: params.type,
    activePlayerId: params.activePlayerId,
    passivePlayerId: params.passivePlayerId,
    timestamp: params.timestamp,
    attackingUnitId: params.attackingUnitId,
    defensiveUnitId: params.defensiveUnitId,
    isAttackerVisible: params.isAttackerVisible,
    isDefenserVisible: params.isDefenserVisible,
  };
}
