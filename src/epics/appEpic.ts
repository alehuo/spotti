import { of } from "rxjs";
import { ofType } from "redux-observable";
import { switchMap, mergeMap } from "rxjs/operators";
import {
  setCurrentTrack_epic,
  clearAllPlayerData,
} from "../reducers/playerReducer";
import {
  INIT_APP_EPIC,
  RESET_APP_EPIC,
} from "../reducers/uiReducer";
import { setToken, clearToken } from "../reducers/authReducer";

export const appInitEpic = (
  action$: any
) =>
  action$.pipe(
    ofType(INIT_APP_EPIC),
    switchMap((action) => // @ts-expect-error
      of(setToken(action.payload.token), setCurrentTrack_epic())
    )
  );

export const appResetEpic = (
  action$: any
) =>
  action$.pipe(
    ofType(RESET_APP_EPIC),
    mergeMap((_action) => of(clearToken(), clearAllPlayerData()))
  );
