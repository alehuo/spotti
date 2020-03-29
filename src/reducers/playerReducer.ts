import { Reducer, action, ActionType } from "typesafe-actions";

enum PlayerStatus {
  PLAYING,
  PAUSED,
  INITIAL
}

const SET_PLAYER_STATUS = "SET_PLAYER_STATUS";
const SET_CURRENT_MS = "SET_CURRENT_MS";

export const setPlayerStatus = (status: PlayerStatus) =>
  action(SET_PLAYER_STATUS, { status });

export const setCurrentMs = (currentMs: number) =>
  action(SET_CURRENT_MS, { currentMs });

export type PlayerReducerAction = ActionType<
  typeof setPlayerStatus | typeof setCurrentMs
>;

export type PlayerReducerState = {
  readonly playerStatus: PlayerStatus;
  readonly currentMs: number;
  readonly totalMs: number;
};

const initialState: PlayerReducerState = {
  playerStatus: PlayerStatus.INITIAL,
  currentMs: 0,
  totalMs: 0
};

export const playerReducer: Reducer<PlayerReducerState, PlayerReducerAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_PLAYER_STATUS:
      return { ...state, playerStatus: action.payload.status };
    case SET_CURRENT_MS:
      return { ...state, currentMs: action.payload.currentMs };
    default:
      return { ...state };
  }
};
