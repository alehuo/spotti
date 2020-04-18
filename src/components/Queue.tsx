import React from "react";
import { useTypedSelector } from "../reducers/rootReducer";
import { styled } from "../customStyled";
import { TrackItem } from "../services/SearchService";
import { MillisToMinutesAndSeconds, trimLength } from "../utils";

const QueueTitle = styled.div`
  height: 32px;
`;

const QueueWrapper = styled.div`
  padding: 16px;
  width: 100%;
  max-width: 450px;
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

const QueueList = styled.ol`
  padding-left: 1.5em;
`;

const QueueItem = styled.li``;

const QueueItemContentWrapper = styled.div`
  display: grid;
  grid-template-columns: calc(100% - 70px) 70px;
`;

interface TrackItemPosition {
  seek: number;
}

const mapQueItems = (
  items: TrackItem[],
  currentMs: number,
  songData: TrackItem
): Array<TrackItem & TrackItemPosition> => {
  let delta = 0;
  const mappedItems = items.map((item) => {
    const tmp = {
      ...item,
      seek: songData.duration_ms - currentMs + delta,
    };
    delta += item.duration_ms;
    return tmp;
  });
  return mappedItems;
};

export const Queue: React.FC = () => {
  const queueItems = useTypedSelector((state) => state.queue.queueItems);
  const currentMs = useTypedSelector((state) => state.player.currentMs);
  const songData = useTypedSelector((state) => state.player.songData);
  return (
    <QueueWrapper>
      <QueueTitle>Current queue ({queueItems.length})</QueueTitle>
      <QueueContents>
        <QueueList>
          {songData !== null &&
            mapQueItems(queueItems, currentMs, songData).map((queueItem, i) => (
              <QueueItem key={i}>
                <QueueItemContentWrapper>
                  <div>
                    <b>{trimLength(queueItem.name, 45)}</b>
                    <br />
                    {trimLength(
                      queueItem.artists.map((artist) => artist.name).join(", "),
                      45
                    )}
                  </div>
                  <div>
                    ( - <MillisToMinutesAndSeconds value={queueItem.seek} /> )
                  </div>
                </QueueItemContentWrapper>
              </QueueItem>
            ))}
        </QueueList>
      </QueueContents>
    </QueueWrapper>
  );
};
