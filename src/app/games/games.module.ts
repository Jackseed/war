import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './+state/game.service';
import { GameViewComponent } from './game-view/game-view.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameFormComponent } from './game-form/game-form.component';
import { MatButtonModule } from '@angular/material/button';
import { BoardModule } from '../board/board.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    GameViewComponent,
    GameListComponent,
    GameFormComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    BoardModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    GameService
  ]
})
export class GamesModule { }
