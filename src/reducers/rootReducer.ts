import { playerReducer } from "./playerReducer";
import { authReducer } from "./authReducer";
import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";
import { uiReducer } from "./uiReducer";
import { playlistReducer } from "./playlistReducer";
import { queueReducer } from "./queueReducer";
import { connectRouter } from "connected-react-router";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { History } from "history";

export type Reducer<T, K> = (state: T, action: K) => T;

export const createRootReducer = (history: History) =>
  combineReducers({
    player: playerReducer,
    auth: authReducer,
    ui: uiReducer,
    playlist: playlistReducer,
    queue: queueReducer,
    router: connectRouter(history),
  });

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
