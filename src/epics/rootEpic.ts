import { combineEpics } from "redux-observable";
import {
  playSongEpic,
  pausePlaybackEpic,
  resumePlaybackEpic,
  playPlaylistEpic,
  setCurrentTrackEpic
} from "./playerEpic";
import { addToQueueEpic } from "./queueEpic";
import { appInitEpic } from "./appEpic";

export const rootEpic = combineEpics(
  playSongEpic,
  playPlaylistEpic,
  pausePlaybackEpic,
  resumePlaybackEpic,
  addToQueueEpic,
  setCurrentTrackEpic,
  appInitEpic
);
