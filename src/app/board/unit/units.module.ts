import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UnitCreationComponent } from './unit-creation/unit-creation.component';
import { UnitBoardComponent } from './unit-board/unit-board.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    UnitCreationComponent,
    UnitBoardComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  exports: [
    UnitCreationComponent,
    UnitBoardComponent,
  ],
})
export class UnitsModule { }
