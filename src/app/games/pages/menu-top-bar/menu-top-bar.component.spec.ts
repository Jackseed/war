import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTopBarComponent } from './menu-top-bar.component';

describe('MenuTopBarComponent', () => {
  let component: MenuTopBarComponent;
  let fixture: ComponentFixture<MenuTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
