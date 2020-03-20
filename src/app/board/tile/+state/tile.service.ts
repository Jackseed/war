import { Injectable } from '@angular/core';
import { syncCollection } from 'src/app/syncCollection';
import { AngularFirestore } from '@angular/fire/firestore';
import { ID } from '@datorama/akita';
import { Unit } from '../../unit/+state';
import { TileQuery } from './tile.query';
import { TileStore } from './tile.store';
import { Tile } from './tile.model';
import { GameService } from 'src/app/games/+state';

@Injectable({ providedIn: 'root' })

export class TileService {
  boardSize: number = this.gameService.boardSize;

  constructor(
    private store: TileStore,
    private query: TileQuery,
    private db: AngularFirestore,
    private gameService: GameService,
  ) {}

  connect(gameId: string) {
    const collection = this.db.collection('games').doc(gameId).collection('tiles');
    return syncCollection(collection, this.store);
  }

  markWithUnit(tileId: ID, unit: Unit) {
    this.store.update(tileId, entity => ({
      unit,
    }));
    this.switchAdjacentTilesParameter(tileId, 'visibility', unit.vision);
  }

  markAsVisible(tileId: ID) {
    this.store.ui.update(tileId, entity => ({ isVisible: true }));
  }

  markAsReachable(tileId: ID) {
    this.store.ui.update(tileId, entity => ({ isReachable: true }));
  }

  markAsSelected(tileId: ID, unit: Unit) {
    this.store.ui.update(tileId, entity => ({ isSelected: true }));
    this.switchAdjacentTilesParameter(tileId, 'reachable', unit.move);
  }

  switchAdjacentTilesParameter(tileId: ID, paramType: 'visibility' | 'reachable', paramValue: number) {
    const tile: Tile = this.query.getEntity(tileId);
    for (let x = -paramValue; x <= paramValue; x++) {
      for (let y = -paramValue; y <= paramValue; y++) {
        const X = tile.x + x;
        const Y = tile.y + y;
        // verifies that the tile is inside the board
        if ((X < this.boardSize) && (X >= 0) && (Y < this.boardSize) && (Y >= 0)) {
          const id = X + this.boardSize * Y;
          if (paramType === 'visibility') {
            this.markAsVisible(id);
          }
          if (paramType === 'reachable') {
            if (id !== 0) {
              this.markAsReachable(id);
            }
          }
        }
      }
    }
  }
}
