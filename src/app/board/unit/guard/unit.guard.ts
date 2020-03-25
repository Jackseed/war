import { Injectable } from '@angular/core';
import { CollectionGuard } from 'akita-ng-fire';
import { UnitState, UnitService } from '../+state';

@Injectable({providedIn: 'root'})
export class UnitGuard extends CollectionGuard<UnitState> {

  constructor(
    service: UnitService,
  ) {
    super(service);
  }

}
