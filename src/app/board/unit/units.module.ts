import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitCreationComponent } from './unit-creation/unit-creation.component';

@NgModule({
  declarations: [UnitCreationComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    UnitCreationComponent,
  ],
})
export class UnitsModule { }
