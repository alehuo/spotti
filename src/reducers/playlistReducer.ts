import { action, ActionType, Reducer } from "typesafe-actions";
import { Playlist } from "../services/PlaylistService";

const SET_PLAYLISTS = "SET_PLAYLISTS";

export const setPlaylists = (playlists: Playlist[]) =>
  action(SET_PLAYLISTS, {
    playlists
  });

export type PlaylistReducerAction = ActionType<typeof setPlaylists>;

export type PlaylistReducerState = {
  readonly playlists: Playlist[];
};

const initialState: PlaylistReducerState = {
  playlists: []
};

export const playlistReducer: Reducer<PlaylistReducerState, PlaylistReducerAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_PLAYLISTS:
      return { ...state, playlists: [...action.payload.playlists] };
    default:
      return { ...state };
  }
};
