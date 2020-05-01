import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageBoardComponent } from "./message-board/message-board.component";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";

@NgModule({
  declarations: [MessageBoardComponent],
  imports: [CommonModule, MatCardModule, MatListModule],
  exports: [MessageBoardComponent],
})
export class MessageModule {}
