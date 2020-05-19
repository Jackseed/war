import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/+state";

@Component({
  selector: "app-menu-top-bar",
  templateUrl: "./menu-top-bar.component.html",
  styleUrls: ["./menu-top-bar.component.scss"],
})
export class MenuTopBarComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}