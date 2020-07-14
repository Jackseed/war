import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { slider } from "./animations/slider";
import { AuthService } from "./auth/+state";

@Component({
  selector: "app-root",
  animations: [slider],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "War";

  constructor(public auth: AuthService) {}

  public prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      // tslint:disable-next-line: no-string-literal
      outlet.activatedRouteData["animation"]
    );
  }
}
