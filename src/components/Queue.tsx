import React from "react";
import { useTypedSelector } from "../reducers/rootReducer";
import styled from "styled-components";

const QueueTitle = styled.div`
  height: 32px;
`;

const QueueWrapper = styled.div`
  padding: 16px;
  width: 100%;
  height: 100%;
`;

const QueueContents = styled.div`
  width: 100%;
  height: calc(100% - 32px);
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0px;
  }
  font-size: 0.7em;
`;

const QueueList = styled.ol``;

const QueueItem = styled.li``;

export const Queue: React.FC = () => {
  const queueItems = useTypedSelector((state) => state.queue.queueItems);
  return (
    <QueueWrapper>
      <QueueTitle>Current queue ({queueItems.length})</QueueTitle>
      <QueueContents>
        <QueueList>
          {queueItems.map((queueItem, i) => (
            <QueueItem key={i}>
              {queueItem.artists.map((artist) => artist.name).join(", ")}
              {" - "}
              <b>{queueItem.name}</b>
            </QueueItem>
          ))}
        </QueueList>
      </QueueContents>
    </QueueWrapper>
  );
};
