import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayerBoardComponent } from "./player-board/player-board.component";

@NgModule({
  declarations: [PlayerBoardComponent],
  imports: [CommonModule],
  exports: [PlayerBoardComponent],
})
export class PlayerModule {}
