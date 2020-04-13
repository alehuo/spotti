import { of } from "rxjs";
import { Epic, ofType } from "redux-observable";
import { concatMap } from "rxjs/operators";
import {
  setCurrentTrack_epic,
  clearAllPlayerData,
} from "../reducers/playerReducer";
import { RootState } from "../reducers/rootReducer";
import { INIT_APP_EPIC, RESET_APP_EPIC } from "../reducers/uiReducer";
import { setToken, clearToken } from "../reducers/authReducer";

export const appInitEpic: Epic<any, any, RootState> = (action$, _state$) =>
  action$.pipe(
    ofType(INIT_APP_EPIC),
    concatMap((action) =>
      of(setToken(action.payload.token), setCurrentTrack_epic())
    )
  );

export const appResetEpic: Epic<any, any, RootState> = (action$, _state$) =>
  action$.pipe(
    ofType(RESET_APP_EPIC),
    concatMap((_action) => of(clearToken(), clearAllPlayerData()))
  );
