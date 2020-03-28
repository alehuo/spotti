import { Reducer } from "./rootReducer";

enum PlayerStatus {
  PLAYING,
  PAUSED,
  INITIAL
}

const SET_PLAYER_STATUS = "SET_PLAYER_STATUS";
const SET_CURRENT_MS = "SET_CURRENT_MS";

export const setPlayerStatus = (status: PlayerStatus) => {
  return {
    type: SET_PLAYER_STATUS,
    playload: {
      status
    }
  } as const;
};

export const setCurrentMs = (currentMs: number) => {
  return {
    type: SET_CURRENT_MS,
    playload: {
      currentMs
    }
  } as const;
};

export type PlayerReducerAction = ReturnType<
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
      return { ...state, playerStatus: action.playload.status };
    case SET_CURRENT_MS:
      return { ...state, currentMs: action.playload.currentMs };
    default:
      return { ...state };
  }
};
