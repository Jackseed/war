import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OpponentUnitStore, OpponentUnitState } from './opponent-unit.store';

@Injectable({ providedIn: 'root' })
export class OpponentUnitQuery extends QueryEntity<OpponentUnitState> {

  constructor(protected store: OpponentUnitStore) {
    super(store);
  }

}
