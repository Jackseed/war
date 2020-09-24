import { Injectable } from "@angular/core";
import { PresenceService } from "src/app/auth/presence/presence.service";
import { QueryEntity } from "@datorama/akita";
import { GameStore, GameState } from "./game.store";
import { Game } from "./game.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { map, tap, first } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class GameQuery extends QueryEntity<GameState> {
  constructor(
    protected store: GameStore,
    private afAuth: AngularFireAuth,
    private presenceService: PresenceService
  ) {
    super(store);
  }

  get playerGames(): Observable<Game[]> {
    const user = this.afAuth.auth.currentUser;
    return this.selectAll({
      filterBy: game => game.playerIds.includes(user.uid)
    });
  }

  get otherGames(): Observable<Game[]> {
    const user = this.afAuth.auth.currentUser;
    return this.selectAll({
      filterBy: game => !game.playerIds.includes(user.uid)
    });
  }

  get playersReadyCount(): Observable<number> {
    return this.selectActive().pipe(map(game => game.playersReady.length));
  }

  get playersRematchCount(): Observable<number> {
    return this.selectActive().pipe(map(game => game.playersRematch.length));
  }

  get isPlayerReady(): Observable<boolean> {
    const user = this.afAuth.auth.currentUser;
    return this.selectActive().pipe(
      map(game => game.playersReady.includes(user.uid))
    );
  }

  get isPlayerRematch(): Observable<boolean> {
    const user = this.afAuth.auth.currentUser;
    return this.selectActive().pipe(
      map(game => game.playersRematch.includes(user.uid))
    );
  }

  get gameStatus$(): Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  > {
    return this.selectActive().pipe(map(game => game.status));
  }

  // get all instant games with 1 online player
  get instantPlayableGames$(): Observable<Game[]> {
    const user = this.afAuth.auth.currentUser;
    let playableGames$: Observable<Game[]>;
    const instantGames$ = this.selectAll({
      filterBy: game =>
        game.isInstant &&
        game.playerIds.length === 1 &&
        !game.playerIds.includes(user.uid)
    });

    playableGames$ = instantGames$.pipe(
      tap(games =>
        games.map(game =>
          this.presenceService.selectPresence(game.playerIds[0]).pipe(
            map(status => {
              if (status.status === "online") {
                return game;
              } else {
                return;
              }
            })
          )
        )
      )
    );
    return playableGames$;
  }

  get instantPlayableGame(): Promise<Game[]> {
    return this.instantPlayableGames$.pipe(first()).toPromise();
  }
}
