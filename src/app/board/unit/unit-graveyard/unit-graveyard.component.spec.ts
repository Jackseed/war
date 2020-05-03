import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitGraveyardComponent } from './unit-graveyard.component';

describe('UnitGraveyardComponent', () => {
  let component: UnitGraveyardComponent;
  let fixture: ComponentFixture<UnitGraveyardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitGraveyardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitGraveyardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
