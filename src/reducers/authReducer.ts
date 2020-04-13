import { action, ActionType, Reducer } from "typesafe-actions";

const SET_TOKEN = "SET_TOKEN";
const CLEAR_TOKEN = "CLEAR_TOKEN";

export const setToken = (token: string) =>
  action(SET_TOKEN, {
    token,
  });

export const clearToken = () => action(CLEAR_TOKEN);

export type AuthReducerAction = ActionType<typeof setToken | typeof clearToken>;

export type AuthReducerState = {
  readonly token: string;
};

const initialState: AuthReducerState = {
  token: "",
};

export const authReducer: Reducer<AuthReducerState, AuthReducerAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, token: action.payload.token };
    case CLEAR_TOKEN:
      return { ...state, token: "" };
    default:
      return { ...state };
  }
};
