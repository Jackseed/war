import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GameViewComponent } from "./games/game-view/game-view.component";
import { GameGuard } from "./games/guard/game.guard";
import { ActiveGameGuard } from "./games/guard/active-game.guard";
import { PlayerGuard } from "./board/player/guard/player.guard";
import { UnitGuard } from "./board/unit/guard/unit.guard";
import { LoginComponent } from "./auth/login/login.component";
import { ActiveAuthGuard } from "./auth/guard/active-auth.guard";
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from "@angular/fire/auth-guard";
import { MessageGuard } from "./board/message/guard/message.guard";
import { HomepageComponent } from "./games/homepage/homepage.component";
import { CreateComponent } from "./games/pages/create/create.component";
import { ChampionsComponent } from "./games/pages/champions/champions.component";
import { JoinComponent } from "./games/pages/join/join.component";
import { EmailComponent } from "./auth/login/email/email.component";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["welcome"]);

export const routes: Routes = [
  {
    path: "welcome",
    component: LoginComponent,
  },
  {
    path: "home",
    canActivate: [AngularFireAuthGuard, GameGuard, ActiveAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    canDeactivate: [GameGuard, ActiveAuthGuard],
    component: HomepageComponent,
  },
  {
    path: "save-account",
    canActivate: [AngularFireAuthGuard, GameGuard, ActiveAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    canDeactivate: [GameGuard, ActiveAuthGuard],
    component: EmailComponent,
  },
  {
    path: "create",
    canActivate: [AngularFireAuthGuard, GameGuard, ActiveAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin, animation: "isRight" },
    canDeactivate: [GameGuard, ActiveAuthGuard],
    component: CreateComponent,
  },
  {
    path: "champions",
    canActivate: [AngularFireAuthGuard, GameGuard, ActiveAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    canDeactivate: [GameGuard, ActiveAuthGuard],
    component: ChampionsComponent,
  },
  {
    path: "games",
    canActivate: [AngularFireAuthGuard, GameGuard, ActiveAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin, animation: "isLeft" },
    canDeactivate: [GameGuard, ActiveAuthGuard],
    component: JoinComponent,
  },
  {
    path: "games/:id",
    canActivate: [ActiveGameGuard, AngularFireAuthGuard, ActiveAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    canDeactivate: [ActiveGameGuard, ActiveAuthGuard],
    children: [
      {
        path: "",
        canActivate: [PlayerGuard, MessageGuard],
        canDeactivate: [PlayerGuard, MessageGuard],
        children: [
          {
            path: "",
            canActivate: [UnitGuard],
            canDeactivate: [UnitGuard],
            component: GameViewComponent,
          },
        ],
      },
    ],
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
