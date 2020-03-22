import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PlayerStore, PlayerState } from './player.store';
import { Player } from './player.model';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlayerQuery extends QueryEntity<PlayerState> {

  constructor(protected store: PlayerStore) {
    super(store);
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
