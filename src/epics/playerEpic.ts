import { from, of } from "rxjs";
import { Epic, ofType } from "redux-observable";
import {
  filter,
  switchMap,
  map,
  throttleTime,
  debounceTime,
  retry
} from "rxjs/operators";
import {
  PLAY_SONG,
  setPlayerStatus,
  PlayerStatus,
  CONTINUE_PLAYBACK,
  PAUSE_PLAYBACK,
  PLAY_PLAYLIST,
  setCurrentMs,
  setSongData,
  SET_CURRENT_TRACK_EPIC,
  setCurrentTrack_epic
} from "../reducers/playerReducer";
import {
  startPlayingTrack,
  pausePlayback,
  continuePlayback,
  startPlayingPlaylist,
  getCurrentlyPlaying
} from "../services/PlaybackService";
import { RootState } from "../reducers/rootReducer";
import { getTrack } from "../services/SearchService";

export const playSongEpic: Epic<any, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(PLAY_SONG),
    throttleTime(1500),
    switchMap(action =>
      from(startPlayingTrack(state$.value.auth.token, action.payload.uri)).pipe(
        filter(response => response.status === 204),
        switchMap(_res => getTrack(state$.value.auth.token, action.payload.id)),
        filter(response => response.status === 200),
        switchMap(res =>
          of(
            setSongData(res.data),
            setPlayerStatus(PlayerStatus.PLAYING),
            setCurrentMs(0)
          )
        )
      )
    )
  );

export const playPlaylistEpic: Epic<any, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(PLAY_PLAYLIST),
    switchMap(action =>
      startPlayingPlaylist(state$.value.auth.token, action.payload.playlistId)
    ),
    filter(response => response.status === 204),
    debounceTime(800),
    switchMap(_res =>
      of(
        setPlayerStatus(PlayerStatus.PLAYING),
        setCurrentMs(0),
        setCurrentTrack_epic()
      )
    )
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

export const setCurrentTrackEpic: Epic<any, any, RootState> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(SET_CURRENT_TRACK_EPIC),
    switchMap(_action =>
      from(getCurrentlyPlaying(state$.value.auth.token)).pipe(
        throttleTime(1500),
        filter(res => res.status === 200),
        switchMap(res => getTrack(state$.value.auth.token, res.data.item.id)),
        map(response => setSongData(response.data)),
        retry(2)
      )
    )
  );
