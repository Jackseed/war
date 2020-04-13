import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PlayerStore, PlayerState } from './player.store';
import { Player } from './player.model';

@Injectable({ providedIn: 'root' })
export class PlayerQuery extends QueryEntity<PlayerState> {

  constructor(
    protected store: PlayerStore
  ) {
    super(store);
  }

  public get opponentId(): string {
    const activePlayerId: string = this.getActiveId();
    const players: Player[] = this.getAll();
    return players.filter(player => player.id !== activePlayerId)[0].id;
  }

}
