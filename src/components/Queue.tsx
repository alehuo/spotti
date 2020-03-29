import React from "react";
import "./Queue.scss";
import { useTypedSelector } from "../reducers/rootReducer";

export const Queue: React.FC = () => {
  const queueItems = useTypedSelector(state => state.queue.queueItems);
  return (
    <div className="queue">
      <div className="queue-title">Current queue</div>
      <div className="queue-contents">
        <ol>
          {queueItems.map((queueItem, i) => (
            <li key={i}>{queueItem}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};
