import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireModule } from "@angular/fire";
import {
  NoopAnimationsModule,
  BrowserAnimationsModule,
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

const firebaseConfig = {
  apiKey: "AIzaSyAT7U1JZwZlf1RHIP184HFgJh7s7zVmVHI",
  authDomain: "war-prod.firebaseapp.com",
  databaseURL: "https://war-prod.firebaseio.com",
  projectId: "war-prod",
  storageBucket: "war-prod.appspot.com",
  messagingSenderId: "116993685114",
  appId: "1:116993685114:web:08d8985c03aff9cf2dedc3",
  measurementId: "G-NQQGTLNZVD",
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
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
  ],
  providers: [
    ActiveAuthGuard,
    AngularFireAuthGuard,
    UnitGuard,
    PlayerGuard,
    GameGuard,
    ActiveGameGuard,
    MessageGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
