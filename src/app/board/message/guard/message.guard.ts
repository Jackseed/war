import { Injectable } from '@angular/core';
import { CollectionGuardConfig, CollectionGuard } from 'akita-ng-fire';
import { MessageState, MessageStore, MessageService } from '../+state';
import { GameQuery } from 'src/app/games/+state';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
@CollectionGuardConfig({ awaitSync: true })
export class MessageGuard extends CollectionGuard<MessageState> {

  constructor(
    service: MessageService,
    private store: MessageStore,
    private gameQuery: GameQuery,
  ) {
    super(service);
  }

  sync() {
    return this.gameQuery.selectActiveId().pipe(
      tap(_ => this.store.reset()),
      switchMap(gameId => this.service.syncCollection({ params: { gameId }}))
    );
  }

}
