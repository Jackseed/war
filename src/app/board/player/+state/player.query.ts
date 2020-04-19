import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PlayerStore, PlayerState } from './player.store';
import { Player } from './player.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlayerQuery extends QueryEntity<PlayerState> {

  constructor(
    protected store: PlayerStore
  ) {
    super(store);
  }

  public get opponent(): Player {
    const activePlayerId = this.getActiveId();
    const players = this.getAll();
    return players.filter(player => player.id !== activePlayerId)[0];
  }

  public get opponent$(): Observable<Player> {
    const activePlayerId = this.getActiveId();
    const players$ = this.selectAll();

    return players$.pipe(
      map(players =>
        players.filter(player => player.id !== activePlayerId)[0])
    );
  }

}
