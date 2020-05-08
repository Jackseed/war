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
import { UnitGraveyardComponent } from "./unit-graveyard/unit-graveyard.component";

@NgModule({
  declarations: [
    UnitCreationComponent,
    UnitBoardComponent,
    UnitGraveyardComponent,
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatDividerModule,
  ],
  exports: [UnitCreationComponent, UnitBoardComponent, UnitGraveyardComponent],
})
export class UnitsModule {}
