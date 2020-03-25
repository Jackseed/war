import { Injectable } from '@angular/core';
import { CollectionGuard, CollectionGuardConfig } from 'akita-ng-fire';
import { OpponentUnitService, OpponentUnitState } from '../+state';

@Injectable({providedIn: 'root'})
@CollectionGuardConfig({
  queryFn: (ref) => ref.limit(10),
})
export class OpponentUnitGuard extends CollectionGuard<OpponentUnitState> {

  constructor(
    service: OpponentUnitService,
  ) {
    super(service);
  }

}
