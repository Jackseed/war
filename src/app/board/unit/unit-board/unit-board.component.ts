import { Component, OnInit } from "@angular/core";
import {
  UnitQuery,
  Unit,
  UnitService,
  maxTotalUnitValue,
  createUnit,
} from "../+state";
import { Observable } from "rxjs";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { GameQuery } from "src/app/games/+state";

@Component({
  selector: "app-unit-board",
  templateUrl: "./unit-board.component.html",
  styleUrls: ["./unit-board.component.scss"],
})
export class UnitBoardComponent implements OnInit {
  public unitTypes = ["soldier", "musketeer", "knight", "cannon"];
  public unitsValue$: Observable<number>;
  public maxTotalUnitValue = maxTotalUnitValue;
  public mouseOvers: boolean[];
  public gameStatus$: Observable<
    "waiting" | "unit creation" | "placement" | "battle" | "finished"
  >;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private query: UnitQuery,
    private service: UnitService,
    private gameQuery: GameQuery
  ) {
    this.matIconRegistry.addSvgIcon(
      "hp",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/hp.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "vision",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/vision.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "move",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/move.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "stamina",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/stamina.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "power",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/power.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "range",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../../../assets/img/range.svg"
      )
    );
    this.mouseOvers = [false, false, false, false];
  }

  ngOnInit(): void {
    this.unitsValue$ = this.query.selectCount();
    this.gameStatus$ = this.gameQuery.gameStatus$;
  }

  selectUnitType(unitType): Observable<Unit[]> {
    return this.query.selectAll({
      filterBy: (unit) => unit.type === unitType,
    });
  }

  addUnit(unitType) {
    const totalUnitQuantity: number = this.query.getCount();
    if (totalUnitQuantity < maxTotalUnitValue) {
      const tileId = this.query.getCount((unit) => unit.type === unitType);
      this.service.addUnit(unitType, tileId);
    }
  }

  // Remove the last unit created from the selected type
  removeUnit(unitType) {
    const units: Unit[] = this.query.getAll({
      filterBy: (unit) => unit.type === unitType,
    });
    if (units.length > 0) {
      this.service.removeUnit(units[units.length - 1]);
    }
  }

  createUnit(unitType): Unit {
    return createUnit(unitType);
  }
}
