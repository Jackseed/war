import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService, AuthQuery, User } from "../../+state";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"],
})
export class EmailComponent implements OnInit {
  form: FormGroup;
  user: User;
  serverMessage: string;
  type: "login" | "signup" | "reset" = "signup";
  loading = false;

  constructor(
    private query: AuthQuery,
    private service: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EmailComponent>
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
    this.loading = true;
    const email = this.email.value;
    const password = this.password.value;
    let snackBarMessage: string;

    if (this.isSignup) {
      this.serverMessage = await this.service.emailSignup(email, password);
      snackBarMessage = "Account saved";
    } else if (this.isLogin) {
      this.serverMessage = await this.service.emailLogin(email, password);
      snackBarMessage = "Successfully connected";
    } else if (this.isPasswordReset) {
      this.serverMessage = await this.service.resetPassword(email);
      snackBarMessage = "Email sent";
    }

    if (!this.serverMessage) {
      this.openSnackBar(snackBarMessage);
      this.form.reset();
      this.dialogRef.close();
    }
    this.loading = false;
  }

  changeType(type) {
    this.type = type;
  }

  get isLogin() {
    return this.type === "login";
  }

  get isSignup() {
    return this.type === "signup";
  }

  get isPasswordReset() {
    return this.type === "reset";
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
