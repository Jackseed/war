import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unit-creation',
  templateUrl: './unit-creation.component.html',
  styleUrls: ['./unit-creation.component.scss']
})
export class UnitCreationComponent implements OnInit {
  unitBoardSize = 3;
  tiles = Math.pow(this.unitBoardSize, 2);

  constructor() { }

  ngOnInit(): void {
  }

}
