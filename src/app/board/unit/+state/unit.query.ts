import { Injectable } from '@angular/core';
import { QueryEntity, EntityUIQuery } from '@datorama/akita';
import { UnitStore, UnitState, UnitUIState } from './unit.store';
import { Observable } from 'rxjs';
import { Unit } from './unit.model';
import { Tile } from '../../tile/+state';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UnitQuery extends QueryEntity<UnitState> {
  ui: EntityUIQuery<UnitUIState>;

  constructor(
    protected store: UnitStore,
    private db: AngularFirestore,
  ) {
    super(store);
  }

  public visibleOpponentUnits$(gameId: string, opponentId: string, visibleTiles: Tile[]): Observable<Unit[]> {
    const visibleTileIds = visibleTiles.map(({id}) => id);
    return this.db.collection('games').doc(gameId).collection('players').doc(opponentId)
      .collection('units', ref => ref.where('tileId', 'in', visibleTileIds)).valueChanges();
  }

  public unitsByType(unitType: 'soldier' | 'musketeer' | 'knight' | 'cannon'): Observable<Unit[]> {
    return this.selectAll({
      filterBy: unit => unit.type === unitType
    });
  }
}
