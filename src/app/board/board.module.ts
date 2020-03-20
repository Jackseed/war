import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board-view/board.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BoardComponent
  ],
  exports: [
    BoardComponent
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
  ]
})
export class BoardModule { }
