import { Injectable } from "@angular/core";
import { User } from "./auth.model";
import { ActiveState, EntityStore, StoreConfig } from "@datorama/akita";
import { CollectionState } from "akita-ng-fire";

export interface AuthState extends CollectionState<User>, ActiveState<string> {}

const initialState = {
  active: null,
};

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "auth" })
export class AuthStore extends EntityStore<AuthState> {
  constructor() {
    super(initialState);
  }
}
