import { action, ActionType, Reducer } from "typesafe-actions";

const ADD_TO_QUEUE = "ADD_TO_QUEUE";

export const addToQueue = (queueItem: string) =>
  action(ADD_TO_QUEUE, {
    queueItem
  });

export type QueueReducerAction = ActionType<typeof addToQueue>;

export type QueueReducerState = {
  readonly queueItems: string[];
};

const initialState: QueueReducerState = {
  queueItems: []
};

export const queueReducer: Reducer<QueueReducerState, QueueReducerAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ADD_TO_QUEUE:
      return {
        ...state,
        queueItems: [...state.queueItems, action.payload.queueItem]
      };
    default:
      return { ...state };
  }
};
