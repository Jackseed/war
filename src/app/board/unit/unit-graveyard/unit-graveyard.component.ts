import { Component, OnInit } from "@angular/core";
import { Unit, UnitQuery } from "../+state";
import { Observable } from "rxjs";

@Component({
  selector: "app-unit-graveyard",
  templateUrl: "./unit-graveyard.component.html",
  styleUrls: ["./unit-graveyard.component.scss"],
})
export class UnitGraveyardComponent implements OnInit {
  public cols = 10;
  public deadUnits$: Observable<Unit[]>;

  constructor(private query: UnitQuery) {}

  ngOnInit(): void {
    this.deadUnits$ = this.query.selectAll({
      filterBy: (unit) => unit.tileId === null,
    });
    this.deadUnits$.subscribe(console.log);
  }
}
