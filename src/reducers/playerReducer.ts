import { Reducer, action, ActionType } from "typesafe-actions";
import { Item } from "../services/SearchService";

export enum PlayerStatus {
  PLAYING,
  PAUSED,
  INITIAL,
}

export const SET_PLAYER_STATUS = "SET_PLAYER_STATUS";
export const SET_CURRENT_MS = "SET_CURRENT_MS";
export const SET_CURRENT_TRACK_EPIC = "SET_CURRENT_TRACK_EPIC";
export const PLAY_SONG = "PLAY_SONG";
export const PAUSE_PLAYBACK = "PAUSE_PLAYBACK";
export const CONTINUE_PLAYBACK = "CONTINUE_PLAYBACK";
export const PLAY_PLAYLIST = "PLAY_PLAYLIST";
export const SET_DEVICE_ID = "SET_DEVICE_ID";
export const SET_SONG_DATA = "SET_SONG_DATA";
export const SET_VOLUME = "SET_VOLUME";
export const CLEAR_ALL_PLAYER_DATA = "CLEAR_ALL_PLAYER_DATA";

export const playSong_epic = (uri: string, id: string) =>
  action(PLAY_SONG, { uri, id });

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

export const setSongData = (songData: Item) =>
  action(SET_SONG_DATA, { songData });

export const setVolume = (volumePercent: number) =>
  action(SET_VOLUME, { volumePercent });

export const setCurrentTrack_epic = () => action(SET_CURRENT_TRACK_EPIC);
export const clearAllPlayerData = () => action(CLEAR_ALL_PLAYER_DATA);

export type PlayerReducerAction = ActionType<
  | typeof setPlayerStatus
  | typeof setCurrentMs
  | typeof playSong_epic
  | typeof continuePlayback
  | typeof pausePlayback
  | typeof playPlaylist
  | typeof setDeviceId
  | typeof setSongData
  | typeof setCurrentTrack_epic
  | typeof setVolume
  | typeof clearAllPlayerData
>;

export type PlayerReducerState = {
  readonly playerStatus: PlayerStatus;
  readonly deviceId: string;
  readonly currentMs: number;
  readonly songData: Item | null;
  readonly volumePercent: number;
};

const initialState: PlayerReducerState = {
  playerStatus: PlayerStatus.INITIAL,
  deviceId: "",
  currentMs: 0,
  songData: null,
  volumePercent: 50,
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
    case SET_SONG_DATA:
      return { ...state, songData: { ...action.payload.songData } };
    case SET_VOLUME:
      return { ...state, volumePercent: action.payload.volumePercent };
    case CLEAR_ALL_PLAYER_DATA:
      return { ...state, ...initialState };
    default:
      return { ...state };
  }
};
