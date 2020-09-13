import { Injectable } from "@angular/core";
import { OpponentUnitStore, OpponentUnitState } from "./opponent-unit.store";
import {
  CollectionConfig,
  CollectionService,
  pathWithParams,
} from "akita-ng-fire";
import { GameQuery } from "src/app/games/+state";
import { PlayerQuery } from "src/app/board/player/+state";
import { Unit } from "../../+state/unit.model";

@Injectable({ providedIn: "root" })
@CollectionConfig({ path: "games/:gameId/players/:opponentId/units" })
export class OpponentUnitService extends CollectionService<OpponentUnitState> {
  constructor(
    store: OpponentUnitStore,
    private gameQuery: GameQuery,
    private query: PlayerQuery
  ) {
    super(store);
  }

  get path(): string {
    const gameId = this.gameQuery.getActiveId();
    const opponentId = this.query.opponent.id;
    const path = "path";
    return pathWithParams(this.constructor[path], { gameId, opponentId });
  }

  public deleteAll() {
    const units = this.query.getAll();
    const collection = this.db.firestore.collection(this.currentPath);
    const batch = this.db.firestore.batch();

    for (const unit of units) {
      const ref = collection.doc(unit.id);
      batch.delete(ref);
    }

    batch.commit();
  }

  public updateUnit(unit: Unit) {
    this.db.collection(this.currentPath).doc(unit.id.toString()).update(unit);
  }
}
