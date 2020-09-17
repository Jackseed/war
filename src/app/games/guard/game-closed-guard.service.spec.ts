import { TestBed } from '@angular/core/testing';

import { GameClosedGuardService } from './game-closed-guard.service';

describe('GameClosedGuardService', () => {
  let service: GameClosedGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameClosedGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
