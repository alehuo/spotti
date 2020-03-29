import { Reducer, action, ActionType } from "typesafe-actions";

const SET_BGCOLOR = "SET_BGCOLOR";
const SET_TEXTCOLOR = "SET_TEXTCOLOR";

export const setBgColor = (bgColor: string) => action(SET_BGCOLOR, { bgColor });
export const setTextColor = (textColor: string) =>
  action(SET_TEXTCOLOR, { textColor });

export type UiReducerAction = ActionType<
  typeof setBgColor | typeof setTextColor
>;

export type UiReducerState = {
  readonly bgColor: string;
  readonly textColor: string;
};

const initialState: UiReducerState = {
  bgColor: "#000000",
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
