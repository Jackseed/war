import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GameViewComponent } from "./game-view/game-view.component";
import { GameListComponent } from "./game-list/game-list.component";
import { GameFormComponent } from "./game-form/game-form.component";
import { MatButtonModule } from "@angular/material/button";
import { BoardModule } from "../board/board.module";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AuthModule } from "../auth/auth.module";
import { UnitsModule } from "../board/unit/units.module";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { HomepageComponent } from "./homepage/homepage.component";
import { CreateComponent } from "./pages/create/create.component";
import { JoinComponent } from "./pages/join/join.component";
import { ChampionsComponent } from "./pages/champions/champions.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { GameHistoryComponent } from "./pages/game-history/game-history.component";

@NgModule({
  declarations: [
    GameViewComponent,
    GameListComponent,
    GameFormComponent,
    HomepageComponent,
    CreateComponent,
    JoinComponent,
    ChampionsComponent,
    GameHistoryComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    BoardModule,
    AuthModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    UnitsModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    ClipboardModule,
  ],
})
export class GamesModule {}
