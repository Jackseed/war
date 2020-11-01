import { Component, OnInit, OnDestroy } from "@angular/core";
import { unitColsLtMd, unitColsXs, Unit, UnitQuery } from "../+state";
import { Observable, Subscription } from "rxjs";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-unit-creation",
  templateUrl: "./unit-creation.component.html",
  styleUrls: ["./unit-creation.component.scss"],
})
export class UnitCreationComponent implements OnInit, OnDestroy {
  private watcher: Subscription;
  public cols: number;
  public unitTypes = ["soldier", "musketeer", "knight", "cannon"];

  constructor(private query: UnitQuery, private mediaObserver: MediaObserver) {
    this.watcher = this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        if (change.mqAlias === "xs") {
          this.cols = unitColsXs;
        } else {
          this.cols = unitColsLtMd;
        }
      });
  }

  ngOnInit(): void {}

  public selectUnitByType(unitType): Observable<Unit[]> {
    return this.query.unitsByType$(unitType);
  }

  ngOnDestroy() {
    this.watcher ? this.watcher.unsubscribe(): false;
  }
}
