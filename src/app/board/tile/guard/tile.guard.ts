import { Injectable } from '@angular/core';
import { TileState, TileService } from '../+state';
import { CollectionGuard } from 'akita-ng-fire';

@Injectable({providedIn: 'root'})
export class TileGuard extends CollectionGuard<TileState> {

  constructor(
    service: TileService,
  ) {
    super(service);
  }

}
