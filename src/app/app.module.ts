import { BrowserModule } from "@angular/platform-browser";
import { GameClosedGuardService } from "src/app/games/guard/game-closed-guard.service";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  AngularFirestoreModule,
  FirestoreSettingsToken,
  SETTINGS
} from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import {
  NoopAnimationsModule,
  BrowserAnimationsModule
} from "@angular/platform-browser/animations";
import { GamesModule } from "./games/games.module";
import { BoardModule } from "./board/board.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AuthModule } from "./auth/auth.module";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { ActiveAuthGuard } from "./auth/guard/active-auth.guard";
import { AkitaNgDevtools } from "@datorama/akita-ngdevtools";
import { environment } from "../environments/environment";
import { TilesModule } from "./board/tile/tiles.module";
import { UnitsModule } from "./board/unit/units.module";
import { FormsModule } from "@angular/forms";
import { PlayerModule } from "./board/player/player.module";
import { RouterModule } from "@angular/router";
import { ActiveGameGuard } from "./games/guard/active-game.guard";
import { UnitGuard } from "./board/unit/guard/unit.guard";
import { PlayerGuard } from "./board/player/guard/player.guard";
import { GameGuard } from "./games/guard/game.guard";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";
import { MessageModule } from "./board/message/message.module";
import { MessageGuard } from "./board/message/guard/message.guard";
import { MatDialogRef } from "@angular/material/dialog";
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NoopAnimationsModule,
    GamesModule,
    BoardModule,
    UnitsModule,
    TilesModule,
    PlayerModule,
    MessageModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AuthModule,
    FormsModule,
    RouterModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ActiveAuthGuard,
    AngularFireAuthGuard,
    UnitGuard,
    PlayerGuard,
    GameGuard,
    ActiveGameGuard,
    MessageGuard,
    GameClosedGuardService,
    {
      provide: MatDialogRef,
      useValue: {}
    }
    /*     {
      provide: SETTINGS,
      useValue: environment.production
        ? undefined
        : {
            host: "localhost:8080",
            ssl: false,
          },
    }, */
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
