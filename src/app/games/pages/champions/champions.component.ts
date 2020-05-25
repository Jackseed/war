import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
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
export class ChampionsComponent implements OnInit, OnDestroy {
  users$: Observable<User[]>;
  user: User;
  dataSource = new MatTableDataSource<User>();
  dataSubscription: Subscription;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
    this.dataSubscription = this.users$.subscribe((users) => {
      this.dataSource.data = users;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }
}
