import { Injectable } from '@angular/core';
import { QueryEntity, EntityUIQuery } from '@datorama/akita';
import { PlayerStore, PlayerState, PlayerUIState } from './player.store';
import { Player } from './player.model';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlayerQuery extends QueryEntity<PlayerState> {
  ui: EntityUIQuery<PlayerUIState>;

  constructor(protected store: PlayerStore) {
    super(store);
    this.createUIQuery();
  }

  public get Opponent$(): Observable<Player> {
    const activePlayerId$: Observable<string> = this.selectActiveId();
    const players$: Observable<Player[]> = this.selectAll();
    return combineLatest([activePlayerId$, players$]).pipe(
      map(([id, players]) => {
        return players.filter(player => player.id !== id)[0];
        })
    );
  }
  
}
