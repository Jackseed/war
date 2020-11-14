import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tuto",
  templateUrl: "./tuto.component.html",
  styleUrls: ["./tuto.component.scss"]
})
export class TutoComponent implements OnInit {
  step: string;
  constructor() {
    this.step = "welcome";
  }

  ngOnInit(): void {}

  public switchStep(nextStep: string) {
    this.step = nextStep;
  }
}
