import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { BoardComponent } from "./board-view/board.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from "@angular/material/button";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { TopBarComponent } from "./board-view/top-bar/top-bar.component";
import { BottomBarComponent } from "./board-view/bottom-bar/bottom-bar.component";
import { MatIconModule } from "@angular/material/icon";
import { MessageModule } from "./message/message.module";

@NgModule({
  declarations: [BoardComponent, TopBarComponent, BottomBarComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MatGridListModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    MatIconModule,
    MessageModule,
  ],
  exports: [BoardComponent, TopBarComponent, BottomBarComponent],
})
export class BoardModule {}
