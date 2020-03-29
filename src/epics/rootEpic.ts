import { combineEpics } from "redux-observable";
import {
  playSongEpic,
  pausePlaybackEpic,
  resumePlaybackEpic,
  playPlaylistEpic
} from "./playerEpic";

export const rootEpic = combineEpics(
  playSongEpic,
  playPlaylistEpic,
  pausePlaybackEpic,
  resumePlaybackEpic
);
