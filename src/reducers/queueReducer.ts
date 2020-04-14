import { action, ActionType, Reducer } from "typesafe-actions";
import { TrackItem } from "../services/SearchService";

export const ADD_TO_QUEUE_EPIC = "ADD_TO_QUEUE_EPIC";
export const ADD_TO_QUEUE = "ADD_TO_QUEUE";

export const addToQueue_epic = (queueItem: TrackItem) =>
  action(ADD_TO_QUEUE_EPIC, {
    queueItem,
  });

export const addSongToQueue = (queueItem: TrackItem) =>
  action(ADD_TO_QUEUE, {
    queueItem,
  });

export type QueueReducerAction = ActionType<
  typeof addSongToQueue | typeof addToQueue_epic
>;

export type QueueReducerState = {
  readonly queueItems: TrackItem[];
};

const initialState: QueueReducerState = {
  queueItems: [],
};

export const queueReducer: Reducer<QueueReducerState, QueueReducerAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ADD_TO_QUEUE:
      return {
        ...state,
        queueItems: [...state.queueItems, action.payload.queueItem],
      };
    default:
      return { ...state };
  }
};
