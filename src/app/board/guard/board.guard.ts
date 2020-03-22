import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { UnitQuery } from '../unit/+state';
import { PlayerQuery, PlayerService } from '../player/+state';
import { TileQuery } from '../tile/+state';
import { take, filter, map, tap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable({
  providedIn: 'root'
})
export class BoardGuard implements CanActivate {

  constructor(
    private playerQuery: PlayerQuery,
    private playerService: PlayerService,
    private tileQuery: TileQuery,
    private unitQuery: UnitQuery,
  ) {}

  sync(next: ActivatedRouteSnapshot) {
    const loadedPlayers = this.playerQuery.selectAll();
    const loadedTiles = this.tileQuery.selectAll();
    const loadedUnits = this.unitQuery.selectAll();
    console.log('gameID: ', next.params.gameId);
    return loadedPlayers.pipe(
      take(1),
      filter(loaded => !loaded),
      map(() => this.playerService.connect(next.params.gameId).pipe(untilDestroyed(this)).subscribe())
    );

  }

}
