import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameViewComponent } from './games/game-view/game-view.component';
import { GameListComponent } from './games/game-list/game-list.component';
import { GameGuard } from './games/guard/game.guard';
import { ActiveGameGuard } from './games/guard/active-game.guard';
import { PlayerGuard } from './board/player/guard/player.guard';
import { UnitGuard } from './board/unit/guard/unit.guard';
import { TileGuard } from './board/tile/guard/tile.guard';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guard/auth.guard';

const routes: Routes = [
  { path: 'welcome',
  component: LoginComponent,
},
  { path: 'games',
    canActivate: [AuthGuard, GameGuard],
    canDeactivate: [GameGuard],
    component: GameListComponent,
  },
  { path: 'games/:id',
    canActivate: [ActiveGameGuard],
    canDeactivate: [ActiveGameGuard],
    children: [
      {
        path: '',
        canActivate: [PlayerGuard, TileGuard],
        canDeactivate: [PlayerGuard, TileGuard],
        children: [
          {
            path: '',
            canActivate: [UnitGuard],
            canDeactivate: [UnitGuard],
            component: GameViewComponent,
          }
        ]

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
