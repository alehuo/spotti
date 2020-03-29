import { Epic, ofType } from "redux-observable";
import { filter, switchMap, map } from "rxjs/operators";
import {
  PLAY_SONG,
  setPlayerStatus,
  PlayerStatus,
  CONTINUE_PLAYBACK,
  PAUSE_PLAYBACK,
  PLAY_PLAYLIST,
  setCurrentMs
} from "../reducers/playerReducer";
import {
  startPlayingTrack,
  pausePlayback,
  continuePlayback,
  startPlayingPlaylist
} from "../services/PlaybackService";
import { RootState } from "../reducers/rootReducer";
// import { search } from "../services/SearchService";

export const playSongEpic: Epic<any, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(PLAY_SONG),
    switchMap(action =>
      startPlayingTrack(state$.value.auth.token, action.payload.songId)
    ),
    filter(response => response.status === 204),
    // switchMap(action => search(state$.value.auth.token, action.payload.songId)),
    map(_response => setPlayerStatus(PlayerStatus.PLAYING)),
    map(_response => setCurrentMs(0))
  );

export const playPlaylistEpic: Epic<any, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(PLAY_PLAYLIST),
    switchMap(action =>
      startPlayingPlaylist(state$.value.auth.token, action.payload.playlistId)
    ),
    filter(response => response.status === 204),
    map(_response => setPlayerStatus(PlayerStatus.PLAYING))
  );

export const pausePlaybackEpic: Epic<any, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(PAUSE_PLAYBACK),
    switchMap(_action =>
      pausePlayback(state$.value.auth.token, state$.value.player.deviceId)
    ),
    filter(response => response.status === 204),
    map(_response => setPlayerStatus(PlayerStatus.PAUSED))
  );

export const resumePlaybackEpic: Epic<any, any, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(CONTINUE_PLAYBACK),
    switchMap(_action =>
      continuePlayback(state$.value.auth.token, state$.value.player.deviceId)
    ),
    filter(response => response.status === 204),
    map(_response => setPlayerStatus(PlayerStatus.PLAYING))
  );
