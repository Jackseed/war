import { TestBed, async, inject } from '@angular/core/testing';

import { ActiveAuthGuard } from './active-auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveAuthGuard]
    });
  });

  it('should ...', inject([ActiveAuthGuard], (guard: ActiveAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
