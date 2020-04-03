import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitCreationComponent } from './unit-creation/unit-creation.component';
import { UnitBoardComponent } from './unit-board/unit-board.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    UnitCreationComponent,
    UnitBoardComponent,
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    UnitCreationComponent,
    UnitBoardComponent,
  ],
})
export class UnitsModule { }
