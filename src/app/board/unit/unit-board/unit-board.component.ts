import { Component, OnInit } from '@angular/core';
import { UnitQuery, Unit, UnitService } from '../+state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-unit-board',
  templateUrl: './unit-board.component.html',
  styleUrls: ['./unit-board.component.scss']
})
export class UnitBoardComponent implements OnInit {
  soldiers$: Observable<Unit[]>;

  constructor(
    private query: UnitQuery,
    private service: UnitService,
  ) {}

  ngOnInit(): void {
    this.soldiers$ = this.query.selectAll({
      filterBy: unit => unit.type === 'soldier'
    });
  }

  addUnit(unitType) {
    const tileId = this.query.getCount(unit => unit.type === unitType);
    this.service.addUnit(unitType, tileId);
  }

  // Remove the last unit created from the selected type
  removeUnit(unitType) {
    const units: Unit[] = this.query.getAll({
      filterBy: unit => unit.type === unitType
    });
    if (units.length > 0) {
      this.service.removeUnit(units[units.length - 1]);
    }
  }

}
