import { TestBed } from '@angular/core/testing';

import { TileGuard } from './tile.guard';

describe('TileGuard', () => {
  let guard: TileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
