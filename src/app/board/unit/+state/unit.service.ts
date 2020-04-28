import { Injectable } from '@angular/core';
import { UnitStore, UnitState } from './unit.store';
import { createUnit, Unit } from './unit.model';
import { GameQuery, boardCols, unitPlacementMargin, xCastle, yCastle } from 'src/app/games/+state';
import { PlayerQuery } from '../../player/+state';
import { CollectionConfig, pathWithParams, CollectionService } from 'akita-ng-fire';
import { UnitQuery } from './unit.query';
import { OpponentUnitQuery } from '../opponent/+state/opponent-unit.query';
import { OpponentUnitService } from '../opponent/+state/opponent-unit.service';
import { TileQuery } from '../../tile/+state/tile.query';

@Injectable({ providedIn: 'root' })
@CollectionConfig({ path: 'games/:gameId/players/:playerId/units' })
export class UnitService extends CollectionService<UnitState> {
  unitTypes: ('soldier' | 'musketeer' | 'knight' | 'cannon')[] = ['soldier', 'musketeer', 'knight', 'cannon'];

  constructor(
    store: UnitStore,
    private query: UnitQuery,
    private gameQuery: GameQuery,
    private playerQuery: PlayerQuery,
    private tileQuery: TileQuery,
    private opponentUnitQuery: OpponentUnitQuery,
    private opponentUnitService: OpponentUnitService,
  ) {
    super(store);
  }

  get path(): string {
    const path = 'path';
    const gameId = this.gameQuery.getActiveId();
    const playerId = this.playerQuery.getActiveId();
    return pathWithParams(this.constructor[path], {gameId, playerId});
  }

  public setUnits() {
    const units = this.defaultPositionUnits;
    const collection = this.db.firestore.collection(this.currentPath);
    const batch = this.db.firestore.batch();

    for (const unit of units) {
      const ref = collection.doc(unit.id);
      batch.set(ref, unit);
    }

    batch.commit();

  }

  private get defaultPositionUnits(): Unit[] {
    const player = this.playerQuery.getActive();
    const units: Unit[] = [];
    let y = unitPlacementMargin;
    let x = unitPlacementMargin;
    let i = 1;
    if (player.color === 'black') {
      x = boardCols - (unitPlacementMargin + 1);
    }
    for (const unitType of this.unitTypes) {
      const typedUnits = this.query.getAll({
        filterBy: unit => unit.type === unitType
      });
      for (let unit of typedUnits) {
        // avoid the castle
        if (x === xCastle && y === yCastle) {
          y++;
        }
        // give unit coordinates and push
        unit = {
          ...unit,
          tileId: x + y * boardCols,
        };
        units.push(unit);

        // increment y
        if (y < (boardCols - (unitPlacementMargin + 1))) {
          y++;
        // respect the margin and start a new line
        } else {
          if (player.color === 'black') {
            x = boardCols - (unitPlacementMargin + 1) + i;
          } else {
            x = unitPlacementMargin - i;
          }
          y = unitPlacementMargin;
          i++;
        }
      }
    }
    return units;
  }

  public addUnit(unitType, tileId: number) {
    const id = this.db.createId();
    const player = this.playerQuery.getActive();
    this.store.add(createUnit(unitType, id, player.id, player.color, tileId));
  }

  public removeUnit(unit: Unit) {
    this.store.remove(unit.id);
  }

  public updatePosition(unit: Unit, tileId: number) {
    const game = this.gameQuery.getActive();
    if (game.status === 'placement') {
      this.db.collection(this.currentPath).doc(unit.id.toString()).update({tileId});
    } else {
      const stamina = unit.stamina - 1;
      this.db.collection(this.currentPath).doc(unit.id.toString()).update({tileId, stamina});
    }
  }

  public updateUnit(unit: Unit) {
    this.db.collection(this.currentPath)
      .doc(unit.id.toString()).update(unit);
  }

  public swapUnitPositions(tileId: number) {
    const clickedUnit = this.query.getUnitByTileId(tileId);
    const activeUnit = this.query.getActive();
    const collection = this.db.firestore.collection(this.currentPath);
    const batch = this.db.firestore.batch();

    batch.update(collection.doc(clickedUnit.id), {tileId: activeUnit.tileId});
    batch.update(collection.doc(activeUnit.id), {tileId: clickedUnit.tileId});

    batch.commit();
  }

  public attack(attackingUnit: Unit, tileId: number) {
    let opponentUnit = this.opponentUnitQuery.getUnitByTileId(tileId);
    // verify that there is a unit on the attacked tile and attack
    if (opponentUnit) {
      const oppWithinCounterAttackRange =
        this.tileQuery.getWithinRangeTiles(opponentUnit.tileId, opponentUnit.range).includes(attackingUnit.tileId);
      console.log('beginning of the fight: attack ', attackingUnit, 'defense: ', opponentUnit);
      this.messageService.messageFactory('attack', )
      opponentUnit = this.fight(attackingUnit, opponentUnit);
      // if the attacked unit survived and is within range, counter attack
      if (opponentUnit.quantity > 0 && oppWithinCounterAttackRange) {
        attackingUnit = this.fight(opponentUnit, attackingUnit);
      }
      this.updateUnit(attackingUnit);
      this.opponentUnitService.updateUnit(opponentUnit);
      console.log('result of the fight: attack ', attackingUnit, 'defense: ', opponentUnit);
    } else {
      console.log('you missed your shot');
    }

  }

  private fight(attackingUnit: Unit, defensiveUnit: Unit): Unit {
    const baseDefensiveUnit = createUnit(defensiveUnit.type);
    const attackValue = attackingUnit.power * attackingUnit.quantity;
    const defenseValue = defensiveUnit.hp * defensiveUnit.quantity;
    const resultingDefensiveTotaltHP = defenseValue - attackValue;
    const resultingDefensiveQuantity = Math.floor(resultingDefensiveTotaltHP / baseDefensiveUnit.hp);

    if (resultingDefensiveQuantity <= 0) {
      defensiveUnit = {
        ...defensiveUnit,
        tileId: null,
        quantity: 0,
        hp: 0,
      };
    } else {
      const resultingDefensiveHP = resultingDefensiveTotaltHP % baseDefensiveUnit.hp === 0 ?
        baseDefensiveUnit.hp : resultingDefensiveTotaltHP % baseDefensiveUnit.hp;

      defensiveUnit = {
        ...defensiveUnit,
        quantity: resultingDefensiveQuantity,
        hp: resultingDefensiveHP
      };
    }
    return defensiveUnit;
  }
}
