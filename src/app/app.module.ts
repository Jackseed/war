import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UnitComponent } from './unit/unit.component';
import { TileComponent } from './tile/tile.component';
import { BoardComponent } from './board/board.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


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
    UnitComponent,
    TileComponent,
    BoardComponent
  ],
  imports: [

    MatGridListModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
