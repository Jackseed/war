import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { AuthStore, AuthState } from "./auth.store";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthQuery extends QueryEntity<AuthState> {
  constructor(protected store: AuthStore) {
    super(store);
  }

  selectIsOpen(): Observable<boolean> {
    return this.select((state) => state.ui.isOpen);
  }
  getIsOpen(): boolean {
    return this.getValue().ui.isOpen;
  }
}
