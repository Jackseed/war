import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { EntityState, ActiveState, EntityStore, StoreConfig } from '@datorama/akita';

export interface MessageState extends EntityState<Message, string>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'message' })
export class MessageStore extends EntityStore<MessageState> {

  constructor() {
    super();
  }

}

