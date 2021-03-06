import { QueryEntity, QueryConfig, Order } from "@datorama/akita";
import { TileStore, TileState } from "./tile.store";
import { Observable } from "rxjs";
import { Tile } from ".";
import { map } from "rxjs/operators";
import { UnitQuery } from "../../unit/+state/unit.query";
import { Unit } from "../../unit/+state/unit.model";
import { Injectable } from "@angular/core";
import { boardCols, Castle } from "src/app/games/+state";
import { Player } from "../../player/+state/player.model";
import { PlayerQuery } from "../../player/+state/player.query";

@QueryConfig({
  sortBy: "id",
  sortByOrder: Order.ASC,
})
@Injectable({ providedIn: "root" })
export class TileQuery extends QueryEntity<TileState> {
  constructor(
    protected store: TileStore,
    private unitQuery: UnitQuery,
    private playerQuery: PlayerQuery
  ) {
    super(store);
  }

  public get visibleTileIds$(): Observable<number[]> {
    return this.unitQuery
      .selectAll({
        filterBy: (unit) => unit.tileId !== null,
      })
      .pipe(map((units) => this.visibleTileIds(units)));
  }

  public getAdjacentTiles(tileId: number, paramValue: number): number[] {
    const tile: Tile = this.getEntity(tileId.toString());
    const tileIds: number[] = [];
    for (let x = -paramValue; x <= paramValue; x++) {
      for (let y = -paramValue; y <= paramValue; y++) {
        const X = tile.x + x;
        const Y = tile.y + y;
        // verifies that the tile is inside the board
        if (X < boardCols && X >= 0 && Y < boardCols && Y >= 0) {
          const id = X + boardCols * Y;
          tileIds.push(id);
        }
      }
    }

    return tileIds;
  }

  public getWithinRangeTiles(tileId: number, range: number): number[] {
    const tile: Tile = this.getEntity(tileId.toString());
    const tileIds: number[] = [];

    for (let x = -range; x <= range; x++) {
      for (let y = -range; y <= range; y++) {
        if (x !== -range && x !== range && y !== -range && y !== range) {
        } else {
          const X = tile.x + x;
          const Y = tile.y + y;

          // verifies that the tile is inside the board
          if (X < boardCols && X >= 0 && Y < boardCols && Y >= 0) {
            const id = X + boardCols * Y;
            tileIds.push(id);
          }
        }
      }
    }
    return tileIds;
  }

  public get tileIds$(): Observable<number[]> {
    return this.selectAll().pipe(map((tiles) => tiles.map(({ id }) => id)));
  }

  public get reachableTileIds(): number[] {
    return this.getAll()
      .filter((tile) => tile.isReachable)
      .map((tile) => tile.id);
  }

  public visibleTileIds(units: Unit[]): number[] {
    const visibleIds: number[] = [];
    const player: Player = this.playerQuery.getActive();
    const castle: Castle = Castle(player.color);

    // add the castle visibility
    const castleVisibleIds: number[] = this.getAdjacentTiles(
      castle.tileId,
      castle.vision
    );
    for (const id of castleVisibleIds) {
      visibleIds.push(id);
    }

    // gets the adjacent tiles visible by the unit
    const unitTileIdsArray: number[][] = units.map((unit) =>
      this.getAdjacentTiles(unit.tileId, unit.vision)
    );

    // flatten the array of each unit into one, without duplicate
    for (const ids of unitTileIdsArray) {
      for (const id of ids) {
        if (!visibleIds.includes(id)) {
          visibleIds.push(id);
        }
      }
    }
    return visibleIds;
  }

  public getTileColumnsByNumber(
    startX: number,
    iteration: number,
    negative: boolean
  ): number[] {
    let tileIds: number[] = [];
    if (!negative) {
      for (let i = 0; i < iteration; i++) {
        for (let j = 0; j < boardCols; j++) {
          tileIds.push(startX + i + j * boardCols);
        }
      }
    } else {
      for (let i = 0; i > -iteration; i--) {
        for (let j = 0; j < boardCols; j++) {
          tileIds.push(startX + i + j * boardCols);
        }
      }
    }
    return tileIds;
  }
}
