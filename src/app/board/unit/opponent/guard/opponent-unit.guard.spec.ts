import { TestBed } from '@angular/core/testing';

import { OpponentUnitGuard } from './opponent-unit.guard';

describe('OpponentUnitGuard', () => {
  let guard: OpponentUnitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OpponentUnitGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
