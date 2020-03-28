import React from "react";
import "./Queue.scss";

interface Props {
  token: string;
}

export const Queue: React.FC<Props> = ({ token }) => (
  <div className="queue">
    <div className="queue-title">Current queue</div>
    <div className="queue-contents">
      <ol>
        {[...Array(10)].map((_elem, i) => (
          <li key={i}>Hello world</li>
        ))}
      </ol>
    </div>
  </div>
);
