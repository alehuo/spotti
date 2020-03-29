import { playerReducer } from "./playerReducer";
import { authReducer } from "./authReducer";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createEpicMiddleware } from "redux-observable";
import { StateType } from "typesafe-actions";
import { uiReducer } from "./uiReducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { playlistReducer } from "./playlistReducer";
import { queueReducer } from "./queueReducer";
import { rootEpic } from "../epics/rootEpic";
import logger from "redux-logger";

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

const epicMiddleware = createEpicMiddleware();

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger, epicMiddleware))
);
export type AppDispatch = typeof store.dispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// @ts-ignore
epicMiddleware.run(rootEpic);
