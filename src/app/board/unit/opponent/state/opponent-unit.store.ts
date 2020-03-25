import { Injectable } from '@angular/core';
import { Unit } from '../../+state/unit.model';
import { ActiveState, EntityStore, StoreConfig } from '@datorama/akita';
import { CollectionState } from 'akita-ng-fire';

export interface OpponentUnitState extends CollectionState<Unit>, ActiveState<string> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'opponentUnit' })
export class OpponentUnitStore extends EntityStore<OpponentUnitState> {

  constructor() {
    super();
  }

}

