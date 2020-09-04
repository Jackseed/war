import { Component, OnInit} from "@angular/core";
import { User, AuthQuery } from "src/app/auth/+state";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-champions",
  templateUrl: "./champions.component.html",
  styleUrls: ["./champions.component.scss"],
})
export class ChampionsComponent implements OnInit {
  user: User;
  dataSource: MatTableDataSource<User>;

  constructor(
    private authQuery: AuthQuery,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    const users = this.authQuery.getAll();
    users.sort((a, b) => b.gameWon - a.gameWon);
    for (let i = 0; i < users.length; i++) {
      users[i] = {
        ...users[i],
        rank: i + 1,
      };
    }
    this.dataSource = new MatTableDataSource(users);

    this.matIconRegistry.addSvgIcon(
      "crown",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/crown.svg"
      )
    );
  }

  ngOnInit(): void {
    this.user = this.authQuery.getActive();
  }
}
