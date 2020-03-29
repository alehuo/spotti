import { Reducer, action, ActionType } from "typesafe-actions";

export enum PlayerStatus {
  PLAYING,
  PAUSED,
  INITIAL
}

export const SET_PLAYER_STATUS = "SET_PLAYER_STATUS";
export const SET_CURRENT_MS = "SET_CURRENT_MS";
export const PLAY_SONG = "PLAY_SONG";
export const PAUSE_PLAYBACK = "PAUSE_PLAYBACK";
export const CONTINUE_PLAYBACK = "CONTINUE_PLAYBACK";
export const PLAY_PLAYLIST = "PLAY_PLAYLIST";
export const SET_DEVICE_ID = "SET_DEVICE_ID";

export const playSong = (songId: string) => action(PLAY_SONG, { songId });
export const continuePlayback = () => action(CONTINUE_PLAYBACK);
export const pausePlayback = () => action(PAUSE_PLAYBACK);
export const playPlaylist = (playlistId: string) =>
  action(PLAY_PLAYLIST, { playlistId });
export const setDeviceId = (device_id: string) =>
  action(SET_DEVICE_ID, { device_id });

export const setPlayerStatus = (status: PlayerStatus) =>
  action(SET_PLAYER_STATUS, { status });

export const setCurrentMs = (currentMs: number) =>
  action(SET_CURRENT_MS, { currentMs });

export type PlayerReducerAction = ActionType<
  | typeof setPlayerStatus
  | typeof setCurrentMs
  | typeof playSong
  | typeof continuePlayback
  | typeof pausePlayback
  | typeof playPlaylist
  | typeof setDeviceId
>;

export type PlayerReducerState = {
  readonly playerStatus: PlayerStatus;
  readonly deviceId: string;
  readonly currentMs: number;
  readonly totalMs: number;
};

const initialState: PlayerReducerState = {
  playerStatus: PlayerStatus.INITIAL,
  deviceId: "",
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
    case SET_DEVICE_ID:
      return { ...state, deviceId: action.payload.device_id };
    default:
      return { ...state };
  }
};
