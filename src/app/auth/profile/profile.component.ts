import { Component, OnInit } from "@angular/core";
import { User } from "../+state/auth.model";
import { AuthQuery } from "../+state/auth.query";
import { Observable } from "rxjs";
import { AuthService } from "../+state/auth.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public user$: Observable<User>;
  public user = this.query.getActive();
  public isEditing = false;
  name = new FormControl(this.user.name);

  constructor(private query: AuthQuery, private service: AuthService) {}

  ngOnInit(): void {
    this.user$ = this.query.selectActive();
    this.user = this.query.getActive();
  }

  onSubmit() {}

  public updateName(name: string) {
    this.service.updateName(name);
  }

  public switchEditing() {
    this.isEditing = !this.isEditing;
  }
}
