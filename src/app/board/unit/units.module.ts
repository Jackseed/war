import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UnitCreationComponent } from "./unit-creation/unit-creation.component";
import { UnitBoardComponent } from "./unit-board/unit-board.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
  declarations: [UnitCreationComponent, UnitBoardComponent],
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatDividerModule,
  ],
  exports: [UnitCreationComponent, UnitBoardComponent],
})
export class UnitsModule {}
