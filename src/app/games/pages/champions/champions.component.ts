import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { User, AuthQuery } from "src/app/auth/+state";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-champions",
  templateUrl: "./champions.component.html",
  styleUrls: ["./champions.component.scss"],
})
export class ChampionsComponent implements OnInit {
  users$: Observable<User[]>;
  user: User;

  constructor(
    private authQuery: AuthQuery,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "crown",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/crown.svg"
      )
    );
  }

  ngOnInit(): void {
    this.users$ = this.authQuery.selectAll();
    this.user = this.authQuery.getActive();
  }
}
