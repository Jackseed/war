import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GamesModule } from './games/games.module';
import { BoardModule } from './board/board.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthModule } from './auth/auth.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthGuard } from './auth/guard/auth.guard';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { TilesModule } from './board/tile/tiles.module';
import { UnitsModule } from './board/unit/units.module';
import { FormsModule } from '@angular/forms';
import { PlayerModule } from './board/player/player.module';
import { RouterModule } from '@angular/router';

const firebaseConfig = {
  apiKey: 'AIzaSyC5EgS298a0tP-RS6-3xFf9TJMuEDbspSk',
  authDomain: 'war-77bc4.firebaseapp.com',
  databaseURL: 'https://war-77bc4.firebaseio.com',
  projectId: 'war-77bc4',
  storageBucket: 'war-77bc4.appspot.com',
  messagingSenderId: '891027548677',
  appId: '1:891027548677:web:4553ee924d68363adeca6c'
};

@NgModule({
  declarations: [
    AppComponent,
  ],
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
    FlexLayoutModule,
    AuthModule,
    FormsModule,
    RouterModule,
    environment.production ? [] : AkitaNgDevtools.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
