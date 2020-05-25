import { Component, OnInit, ViewChild } from "@angular/core";
import { User, AuthQuery } from "src/app/auth/+state";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-champions",
  templateUrl: "./champions.component.html",
  styleUrls: ["./champions.component.scss"],
})
export class ChampionsComponent implements OnInit {
  user: User;
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private authQuery: AuthQuery,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    const users = this.authQuery.getAll();
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
    this.dataSource.sort = this.sort;
  }
}
