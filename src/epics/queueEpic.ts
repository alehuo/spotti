import { Observable, from } from "rxjs";
import { Epic, ofType } from "redux-observable";
import { filter, flatMap, switchMap, map, throttleTime } from "rxjs/operators";
import { addToQueue } from "../services/PlaybackService";
import { RootState } from "../reducers/rootReducer";
import { ADD_TO_QUEUE_EPIC, addSongToQueue } from "../reducers/queueReducer";
import { getTrack } from "../services/SearchService";
import { store } from "../reducers/rootReducer";

export const addToQueueEpic: Epic<any, any, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(ADD_TO_QUEUE_EPIC),
    throttleTime(500),
    flatMap(action =>
      from(getTrack(state$.value.auth.token, action.payload.queueItem.id)).pipe(
        filter(response => response.status === 200),
        switchMap(_response =>
          addToQueue(state$.value.auth.token, action.payload.queueItem.uri)
        ),
        filter(response => response.status === 204),
        map(_response => addSongToQueue(action.payload.queueItem))
      )
    )
  );

export const getState$ = (reduxStore: typeof store) => {
  return new Observable(observer => {
    observer.next(reduxStore.getState());
    const unsubscribe = reduxStore.subscribe(function() {
      observer.next(reduxStore.getState());
    });
    return unsubscribe;
  });
};
