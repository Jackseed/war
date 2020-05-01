import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageBoardComponent } from "./message-board/message-board.component";

@NgModule({
  declarations: [MessageBoardComponent],
  imports: [CommonModule],
  exports: [MessageBoardComponent],
})
export class MessageModule {}
