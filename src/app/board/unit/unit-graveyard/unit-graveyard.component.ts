import { Component, OnInit, Input } from "@angular/core";
import { Unit } from "../+state";
import { Observable } from "rxjs";

@Component({
  selector: "app-unit-graveyard",
  templateUrl: "./unit-graveyard.component.html",
  styleUrls: ["./unit-graveyard.component.scss"],
})
export class UnitGraveyardComponent implements OnInit {
  @Input() deadUnits$: Observable<Unit[]>;
  public cols = 10;

  constructor() {}

  ngOnInit(): void {}
}
