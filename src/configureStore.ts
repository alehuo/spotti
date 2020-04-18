import { createBrowserHistory, History } from "history";
import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import { createRootReducer } from "./reducers/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./epics/rootEpic";
import logger from "redux-logger";

export const history = createBrowserHistory();

const epicMiddleware = createEpicMiddleware();

const middleware = (history: History) => {
  if (process.env.NODE_ENV !== "production") {
    return [logger, epicMiddleware, routerMiddleware(history)];
  }
  return [epicMiddleware, routerMiddleware(history)];
};

export const store = createStore(
  createRootReducer(history),
  composeWithDevTools(applyMiddleware(...middleware(history)))
);

export type AppDispatch = typeof store.dispatch;

// @ts-ignore
epicMiddleware.run(rootEpic);
