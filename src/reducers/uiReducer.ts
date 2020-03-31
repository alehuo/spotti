import { Reducer, action, ActionType } from "typesafe-actions";

export const SET_BGCOLOR = "SET_BGCOLOR";
export const SET_TEXTCOLOR = "SET_TEXTCOLOR";
export const INIT_APP_EPIC = "INIT_APP_EPIC";

export const setBgColor = (bgColor: string) => action(SET_BGCOLOR, { bgColor });
export const setTextColor = (textColor: string) =>
  action(SET_TEXTCOLOR, { textColor });

export const initApp_epic = (token: string) => action(INIT_APP_EPIC, { token });

export type UiReducerAction = ActionType<
  typeof setBgColor | typeof setTextColor | typeof initApp_epic
>;

export type UiReducerState = {
  readonly bgColor: string;
  readonly textColor: string;
};

const initialState: UiReducerState = {
  bgColor: "#D87260",
  textColor: "white"
};

export const uiReducer: Reducer<UiReducerState, UiReducerAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_BGCOLOR:
      return { ...state, bgColor: action.payload.bgColor };
    case SET_TEXTCOLOR:
      return { ...state, textColor: action.payload.textColor };
    default:
      return { ...state };
  }
};
