import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayerBoardComponent } from "./player-board/player-board.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [PlayerBoardComponent],
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  exports: [PlayerBoardComponent],
})
export class PlayerModule {}
