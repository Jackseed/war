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
import { UnitsModule } from "./unit/units.module";
import { PlayerModule } from "./player/player.module";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MessageBoardComponent } from "./message/message-board/message-board.component";
import { ConfirmationDialogComponent } from "../games/pages/confirmation-dialog/confirmation-dialog.component";

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
    UnitsModule,
    PlayerModule,
    MatCardModule,
    RouterModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  exports: [
    BoardComponent,
    TopBarComponent,
    BottomBarComponent,
    MessageBoardComponent,
  ],
  entryComponents: [ConfirmationDialogComponent],
})
export class BoardModule {}
