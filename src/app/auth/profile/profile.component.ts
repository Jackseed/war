import { Component, OnInit } from "@angular/core";
import { User } from "../+state/auth.model";
import { AuthQuery } from "../+state/auth.query";
import { Observable } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public user$: Observable<User>;
  constructor(private query: AuthQuery) {}

  ngOnInit(): void {
    this.user$ = this.query.selectActive();
  }
}
