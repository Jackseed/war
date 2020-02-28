import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameViewComponent } from './games/game-view/game-view.component';
import { GameListComponent } from './games/game-list/game-list.component';


const routes: Routes = [
  { path: 'games', component: GameListComponent },
  { path: 'games/:id', component: GameViewComponent },
  { path: '',
    redirectTo: '/games',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
