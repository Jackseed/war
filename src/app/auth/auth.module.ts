import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { ProfileComponent } from "./profile/profile.component";
import { MatCardModule } from "@angular/material/card";
@NgModule({
  declarations: [LoginComponent, ProfileComponent],
  exports: [LoginComponent, ProfileComponent],
  imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatCardModule],
})
export class AuthModule {}
