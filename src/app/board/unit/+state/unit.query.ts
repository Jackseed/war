import { Injectable } from '@angular/core';
import { QueryEntity, EntityUIQuery } from '@datorama/akita';
import { UnitStore, UnitState, UnitUIState } from './unit.store';
import { Observable, combineLatest } from 'rxjs';
import { Unit } from './unit.model';
import { TileQuery, Tile } from '../../tile/+state';
import { GameQuery } from 'src/app/games/+state';
import { PlayerQuery, Player } from '../../player/+state';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UnitQuery extends QueryEntity<UnitState> {
  ui: EntityUIQuery<UnitUIState>;

  constructor(
    protected store: UnitStore,
    private db: AngularFirestore,
    private gameQuery: GameQuery,
    private tileQuery: TileQuery,
    private playerQuery: PlayerQuery,
  ) {
    super(store);
  }

  public get visibleOpponentUnits$(): Observable<Unit[]> {
    const gameId$: Observable<string> = this.gameQuery.selectActiveId();
    const opponent$: Observable<Player> = this.playerQuery.Opponent$;
    const visibleTiles$: Observable<Tile[]> = this.tileQuery.visibleTiles$;
    const visibleOpponentUnitsDocuments$: Observable<Unit[]> =
    combineLatest([gameId$, opponent$, visibleTiles$]).pipe(
      switchMap(([gameId, opponent, visibleTiles]) => {
        return this.db.collection('games').doc(gameId).collection('players').doc(opponent.id)
          .collection('units', ref => ref.where('tileId', 'in', visibleTiles)).valueChanges();
      })
    );
    return visibleOpponentUnitsDocuments$;
  }
}
