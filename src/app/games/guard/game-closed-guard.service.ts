import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";

export interface DeactivationGuarded {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable({
  providedIn: "root"
})
export class GameClosedGuardService
  implements CanDeactivate<DeactivationGuarded> {
  constructor() {}

  canDeactivate(
    component: DeactivationGuarded
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log(component);
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
