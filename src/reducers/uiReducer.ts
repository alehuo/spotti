import { Reducer, action, ActionType } from "typesafe-actions";

const SET_BGCOLOR = "SET_BGCOLOR";

export const setBgColor = (bgColor: string) => action(SET_BGCOLOR, { bgColor });

export type UiReducerAction = ActionType<typeof setBgColor>;

export type UiReducerState = {
  readonly bgColor: string;
};

const initialState: UiReducerState = {
  bgColor: "#000000"
};

export const uiReducer: Reducer<UiReducerState, UiReducerAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_BGCOLOR:
      return { ...state, bgColor: action.payload.bgColor };
    default:
      return { ...state };
  }
};
