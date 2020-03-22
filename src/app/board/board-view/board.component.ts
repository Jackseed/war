import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Tile, TileQuery, TileService } from '../tile/+state';
import { Unit, UnitQuery, UnitService } from '../unit/+state';
import { GameService, GameStore} from 'src/app/games/+state';
import { PlayerService, PlayerQuery, Player, PlayerStore } from '../player/+state';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  gameId: string;
  boardSize: number = this.gameService.boardSize;
  tiles$: Observable<Tile[]>;
  units$: Observable<Unit[]>;
  players$: Observable<Player[]> = this.playerQuery.selectAll();
  visibleTilesWithUnits$: Observable<Tile[]>;
  visibleOpponentUnits$: Observable<Unit[]>;
  visibleTiles$: Observable<Tile[]> = this.tileQuery.visibleTiles$;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private gameStore: GameStore,
    private gameService: GameService,
    private tileQuery: TileQuery,
    private tileService: TileService,
    private unitQuery: UnitQuery,
    private unitService: UnitService,
    private playerStore: PlayerStore,
    private playerService: PlayerService,
    private playerQuery: PlayerQuery,
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.gameStore.setActive(this.gameId);
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.playerService.connect(this.gameId).pipe(untilDestroyed(this)).subscribe();
        this.playerStore.setActive(user.uid);
        this.playerQuery.Opponent$.subscribe(console.log);
        this.tileService.connect(this.gameId).pipe(untilDestroyed(this)).subscribe();
        this.unitService.connect(this.gameId, user.uid).pipe(untilDestroyed(this)).subscribe();
            // Adds units to tiles UI
        this.units$ = this.unitQuery.selectAll().pipe(
          map(units =>
            units.map(unit => {
              if (unit.tileId !== undefined ) {
                this.tileService.markWithUnit(unit.tileId, unit);
              }
              return unit;
            })
        ));
        console.log(2);
        this.visibleOpponentUnits$ = this.unitQuery.visibleOpponentUnits$;
        this.visibleOpponentUnits$.subscribe(console.log);
        /* this.visibleOpponentUnits$ = this.unitQuery.visibleOpponentUnits$.pipe(
          map(units =>
            units.map(unit => {
              if (unit) {
                this.tileService.markWithUnit(unit.tileId, unit);
              }
              return unit;
            })
        ));
        */
      } else {
        // No user is signed in.
        console.log('not signed in');
      }

    });
    this.tiles$ = this.tileQuery.selectTileWithUI();
    // TODO Too many calls
    this.tiles$.subscribe(console.log);
  }

  play(i: number) {
    const player: Player = this.playerQuery.getActive();
    const tile: Tile = this.tileQuery.getEntity(i);
    // If a unit was clicked and belongs to player, turns it selected
    if (tile.unit && (tile.unit.playerId === player.id)) {
      this.tileService.markAsSelected(i, tile.unit);
    }

  }

  createUnits() {
    const player: Player = this.playerQuery.getActive();
    this.unitService.createUnits(this.gameId, player.id);
  }

  ngOnDestroy() {
  }

}
