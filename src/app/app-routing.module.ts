import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameViewComponent } from './games/game-view/game-view.component';
import { GameListComponent } from './games/game-list/game-list.component';
import { GameGuard } from './games/guard/game.guard';
import { ActiveGameGuard } from './games/guard/active-game.guard';
import { PlayerGuard } from './board/player/guard/player.guard';


const routes: Routes = [
  { path: 'games',
    canActivate: [GameGuard],   // start sync (subscribe)
    canDeactivate: [GameGuard], // stop sync (unsubscribe)
    component: GameListComponent },
  { path: 'games/:id',
    canActivate: [ActiveGameGuard],
    canDeactivate: [ActiveGameGuard],
    children: [
      {
        path: '',
        canActivate: [PlayerGuard],
        canDeactivate: [PlayerGuard],
        component: GameViewComponent,
      }
    ]
  },
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
