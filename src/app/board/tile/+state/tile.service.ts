import { Injectable } from "@angular/core";
import { UnitStore, UnitQuery } from "../../unit/+state";
import { TileQuery } from "./tile.query";
import { TileStore } from "./tile.store";
import { Tile, createTile } from "./tile.model";
import {
  boardCols,
  boardMaxTiles,
  unitPlacementMargin,
  GameQuery
} from "src/app/games/+state";
import { PlayerQuery } from "../../player/+state";
import { OpponentUnitQuery } from "../../unit/opponent/+state/opponent-unit.query";

@Injectable({ providedIn: "root" })
export class TileService {
  constructor(
    private store: TileStore,
    private query: TileQuery,
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
    private unitQuery: UnitQuery,
    private unitStore: UnitStore,
    private opponentUnitQuery: OpponentUnitQuery
  ) {}

  public setTiles() {
    const tiles: Tile[] = [];
    const game = this.gameQuery.getActive();

    if (game) {
      for (let i = 0; i < boardCols; i++) {
        for (let j = 0; j < boardCols; j++) {
          const tileId = j + boardCols * i;
          if (tileId < boardMaxTiles) {
            const tile = createTile(tileId, j, i);
            tiles.push(tile);
          }
        }
      }

      this.store.set(tiles);

      if (game.status === "placement") {
        this.setPlacementTiles();
      }
    }
  }

  // TODO : factorize with unit service defaultPositionUnits()
  private setPlacementTiles() {
    const player = this.playerQuery.getActive();
    const placementTilesArea =
      (unitPlacementMargin + 1) * (boardCols - unitPlacementMargin * 2);
    const placementTiles: number[] = [];

    let y = unitPlacementMargin;
    let x = unitPlacementMargin;
    let j = 1;
    if (player.color === "black") {
      x = boardCols - (unitPlacementMargin + 1);
    }

    for (let i = 0; i < placementTilesArea; i++) {
      const tileId = x + y * boardCols;
      placementTiles.push(tileId);
      if (y < boardCols - (unitPlacementMargin + 1)) {
        y++;
      } else {
        if (player.color === "black") {
          x = boardCols - (unitPlacementMargin + 1) + j;
        } else {
          x = unitPlacementMargin - j;
        }
        y = unitPlacementMargin;
        j++;
      }
    }
    this.markAsReachable(placementTiles);
  }

  public markAsSelected(tileId: number) {
    const unit = this.unitQuery.getUnitByTileId(tileId);
    this.removeSelected();
    this.store.update(tileId, { isSelected: true });
    this.unitStore.setActive(unit.id.toString());
  }

  public markAdjacentTilesReachable(tileId: number) {
    const unit = this.unitQuery.getUnitByTileId(tileId);

    let reachableTileIds = this.query.getAdjacentTiles(unit.tileId, unit.move);
    // remove the tile id of the unit
    reachableTileIds = reachableTileIds.filter(
      reachableTileId => reachableTileId !== unit.tileId
    );
    this.markAsReachable(reachableTileIds);
  }

  public markAsReachable(tileIds: number[]) {
    this.store.update(tileIds, { isReachable: true });
  }

  public markWithinRangeTiles(tileId: number) {
    const unit = this.unitQuery.getUnitByTileId(tileId);
    const withinRangeTileIds = this.query.getWithinRangeTiles(
      unit.tileId,
      unit.range
    );

    // if unit range is 1, only units within range are marked
    if (unit.range === 1) {
      const visibleOpponentUnitTileIds = this.opponentUnitQuery
        .visibleUnitTileIds;
      const withinRangeOpponentUnitTileIds = withinRangeTileIds.filter(id =>
        visibleOpponentUnitTileIds.includes(id)
      );

      this.store.update(withinRangeOpponentUnitTileIds, { withinRange: true });
    } else {
      this.store.update(withinRangeTileIds, { withinRange: true });
    }
  }

  public removeInRangeTiles() {
    this.store.update(null, { withinRange: false });
  }

  public removeSelected() {
    this.store.update(null, { isSelected: false });
    this.unitStore.removeActive(this.unitQuery.getActiveId());
  }

  public removeReachable() {
    this.store.update(null, { isReachable: false });
  }
}
