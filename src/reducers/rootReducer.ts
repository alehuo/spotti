import { PlayerReducerState } from "./playerReducer";

export type Reducer<T, K> = (state: T, action: K) => T;

export type RootState = PlayerReducerState;
