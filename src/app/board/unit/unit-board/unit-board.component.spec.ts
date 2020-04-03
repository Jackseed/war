import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitBoardComponent } from './unit-board.component';

describe('UnitBoardComponent', () => {
  let component: UnitBoardComponent;
  let fixture: ComponentFixture<UnitBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
