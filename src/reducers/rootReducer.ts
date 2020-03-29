import { playerReducer } from "./playerReducer";
import { authReducer } from "./authReducer";
import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { StateType } from "typesafe-actions";
import { uiReducer } from "./uiReducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { playlistReducer } from "./playlistReducer";
import { queueReducer } from "./queueReducer";

export type Reducer<T, K> = (state: T, action: K) => T;

const rootReducerObj = {
  player: playerReducer,
  auth: authReducer,
  ui: uiReducer,
  playlist: playlistReducer,
  queue: queueReducer
};

const rootReducer = combineReducers(rootReducerObj);

export type RootState = StateType<typeof rootReducer>;

const composeEnhancers = composeWithDevTools();
export const store = createStore(rootReducer, composeEnhancers);
export type AppDispatch = typeof store.dispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
