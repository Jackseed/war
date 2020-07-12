import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AuthService, AuthQuery, User } from "../../+state";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"],
})
export class EmailComponent implements OnInit {
  form: FormGroup;
  user: User;
  serverMessage: string;

  constructor(
    private query: AuthQuery,
    private service: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.query.getActive();
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.minLength(6), Validators.required]],
      passwordConfirm: ["", []],
    });
  }

  async onSubmit() {
    const email = this.email.value;
    const password = this.password.value;

    this.serverMessage = await this.service.emailSignup(email, password);
    if (!this.serverMessage) {
      this.openSnackBar("Account saved!");
    }
    this.form.reset();
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  get passwordConfirm() {
    return this.form.get("passwordConfirm");
  }

  get passwordDoesMatch() {
    const isMatching = this.password.value === this.passwordConfirm.value;

    if (!isMatching) {
      this.passwordConfirm.setErrors({
        notMatching: true,
      });
    }
    return isMatching;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, "close", {
      duration: 2000,
    });
  }
}
