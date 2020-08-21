import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { GameStore, GameState } from "./game.store";
import { Game } from "./game.model";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class GameQuery extends QueryEntity<GameState> {
  constructor(protected store: GameStore, private afAuth: AngularFireAuth) {
    super(store);
  }

  get playerGames(): Observable<Game[]> {
    const user = this.afAuth.auth.currentUser;
    return this.selectAll({
      filterBy: (game) => game.playerIds.includes(user.uid),
    });
  }

  get otherGames(): Observable<Game[]> {
    const user = this.afAuth.auth.currentUser;
    return this.selectAll({
      filterBy: (game) => !game.playerIds.includes(user.uid),
    });
  }

  get playersReadyCount(): Observable<number> {
    return this.selectActive().pipe(map((game) => game.playersReady.length));
  }

  get gameStatus$(): Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  > {
    return this.selectActive().pipe(map((game) => game.status));
  }
}
