import { of } from "rxjs";
import { ofType, ActionsObservable } from "redux-observable";
import { switchMap, mergeMap } from "rxjs/operators";
import {
  setCurrentTrack_epic,
  clearAllPlayerData,
} from "../reducers/playerReducer";
import {
  INIT_APP_EPIC,
  RESET_APP_EPIC,
  initApp_epic,
  resetApp_epic,
} from "../reducers/uiReducer";
import { setToken, clearToken } from "../reducers/authReducer";
import { ActionType } from "typesafe-actions";

export const appInitEpic = (
  action$: ActionsObservable<ActionType<typeof initApp_epic>>
) =>
  action$.pipe(
    ofType(INIT_APP_EPIC),
    switchMap((action) =>
      of(setToken(action.payload.token), setCurrentTrack_epic())
    )
  );

export const appResetEpic = (
  action$: ActionsObservable<ActionType<typeof resetApp_epic>>
) =>
  action$.pipe(
    ofType(RESET_APP_EPIC),
    mergeMap((_action) => of(clearToken(), clearAllPlayerData()))
  );
