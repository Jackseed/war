import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitCreationComponent } from './unit-creation/unit-creation.component';
import { UnitBoardComponent } from './unit-board/unit-board.component';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [
    UnitCreationComponent,
    UnitBoardComponent,
  ],
  imports: [
    CommonModule,
    MatGridListModule,
  ],
  exports: [
    UnitCreationComponent,
    UnitBoardComponent,
  ],
})
export class UnitsModule { }
