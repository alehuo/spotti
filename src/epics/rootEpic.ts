import { combineEpics } from "redux-observable";
import {
  playSongEpic,
  pausePlaybackEpic,
  resumePlaybackEpic,
  playPlaylistEpic,
  setCurrentTrackEpic
} from "./playerEpic";
import { addToQueueEpic } from "./queueEpic";

export const rootEpic = combineEpics(
  playSongEpic,
  playPlaylistEpic,
  pausePlaybackEpic,
  resumePlaybackEpic,
  addToQueueEpic,
  setCurrentTrackEpic
);
