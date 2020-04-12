import { Component, OnInit } from '@angular/core';
import { unitCols, Unit, UnitQuery } from '../+state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-unit-creation',
  templateUrl: './unit-creation.component.html',
  styleUrls: ['./unit-creation.component.scss']
})
export class UnitCreationComponent implements OnInit {
  cols = unitCols;
  unitTypes = ['soldier', 'musketeer', 'knight', 'cannon'];

  constructor(
    private query: UnitQuery,
  ) {}

  ngOnInit(): void {}

  public selectUnitByType(unitType): Observable<Unit[]> {
    return this.query.unitsByType(unitType);
  }

}
