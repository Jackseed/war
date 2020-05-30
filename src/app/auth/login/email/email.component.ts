import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AuthService, AuthQuery, User } from "../../+state";

@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"],
})
export class EmailComponent implements OnInit {
  email = new FormControl("");
  user: User;
  constructor(
    private query: AuthQuery,
    private service: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.query.getActive();
  }

  onSubmit() {}

  public updateEmail(email: string) {
    this.service.updateEmail(email);
  }
}
