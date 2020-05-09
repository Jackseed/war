import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayerBoardComponent } from "./player-board/player-board.component";
import { MatCardModule } from "@angular/material/card";
@NgModule({
  declarations: [PlayerBoardComponent],
  imports: [CommonModule, MatCardModule],
  exports: [PlayerBoardComponent],
})
export class PlayerModule {}
