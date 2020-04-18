import React, { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { device } from "../vars";
import {
  getAlbumInfo,
  AlbumResponse,
  AlbumItem,
} from "../services/AlbumService";
import { useTypedSelector } from "../reducers/rootReducer";
import { MillisToMinutesAndSeconds, trimLength } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/Button";
import { playSong_epic } from "../reducers/playerReducer";
import {
  faPlay,
  faPlusCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { addToQueue_epic } from "../reducers/queueReducer";

const AlbumViewWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
`;

const AlbumViewModal = styled.div`
  width: 90%;
  height: 90%;
  background-color: white;
  color: black;
  z-index: 11;
  display: grid;
  grid-template-rows: 192px 42px calc(100% - 42px - 192px);
  @media ${device.desktop} {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }
  @media ${device.uhd} {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const AlbumHeader = styled.div`
  display: grid;
  grid-template-columns: 192px calc(100% - 192px - 36px) 36px;
`;

const AlbumImage = styled.img`
  width: 192px;
  height: 192px;
`;

const AlbumInfo = styled.div`
  padding: 8px;
`;

const AlbumTracks = styled.div`
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

const TrackName = styled.div``;
const TrackDuration = styled.div``;
const TrackOptions = styled.div``;

const AlbumTrack = styled.div`
  height: 56px;
  width: 100%;
  display: grid;
  grid-template-columns: calc(100% - 64px - 96px) 64px 96px;
  align-content: center;
  align-items: center;
  padding-left: 8px;
  font-size: 0.7em;
  &:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const AlbumTrackSpacer = styled.div`
  width: 100%;
  height: 42px;
  padding-left: 8px;
  font-size: 1.2em;
  display: flex;
  align-content: center;
  align-items: center;
`;

const ESCAPE_KEY = 27;

const AlbumView: React.FC<RouteComponentProps<{ albumId: string }>> = ({
  history,
  match,
}) => {
  const dispatch = useDispatch();
  const token = useTypedSelector((state) => state.auth.token);
  const queueItems = useTypedSelector((state) => state.queue.queueItems);
  const escListener = useCallback(
    (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case ESCAPE_KEY:
          history.goBack();
          break;
      }
    },
    [history]
  );
  useEffect(() => {
    document.addEventListener("keydown", escListener);
    return () => {
      document.removeEventListener("keydown", escListener);
    };
  }, [escListener]);
  const [albumData, setAlbumData] = useState<AlbumResponse | null>(null);
  useEffect(() => {
    getAlbumInfo(token, match.params.albumId).then((res) => {
      setAlbumData(res);
    });
  }, [match.params.albumId, token]);
  const que = useCallback(
    (itm: AlbumItem) => {
      dispatch(
        addToQueue_epic({
          id: itm.id,
          uri: itm.uri,
        })
      );
    },
    [dispatch]
  );
  return (
    <AlbumViewWrapper
      id="album-wrapper"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        // @ts-ignore
        if (event.target.id === "album-wrapper") {
          history.goBack();
        }
      }}
    >
      {albumData !== null && (
        <AlbumViewModal>
          <AlbumHeader>
            <AlbumImage
              src={albumData.images.find((image) => image.height === 300)?.url}
              alt={albumData.name}
            />
            <AlbumInfo>
              <div>
                <b>{albumData.name}</b>
              </div>
              <div>
                {trimLength(
                  albumData.artists.map((artist) => artist.name).join(", ")
                )}
              </div>
              <div>Released on {albumData.release_date}</div>
            </AlbumInfo>
            <div>
              <Button
                style={{ color: "black" }}
                onClick={() => {
                  history.goBack();
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
          </AlbumHeader>
          <AlbumTrackSpacer>Tracks ({albumData.total_tracks})</AlbumTrackSpacer>
          <AlbumTracks>
            {albumData.tracks.items.map((item) => (
              <AlbumTrack key={item.id}>
                <TrackName>{item.name}</TrackName>
                <TrackDuration>
                  <MillisToMinutesAndSeconds value={item.duration_ms} />
                </TrackDuration>
                <TrackOptions>
                  {queueItems.length === 0 && (
                    <Button
                      style={{ color: "black" }}
                      onClick={() => dispatch(playSong_epic(item.uri, item.id))}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
                  )}
                  <Button
                    style={{ color: "black" }}
                    onClick={() => {
                      que(item);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </Button>
                </TrackOptions>
              </AlbumTrack>
            ))}
          </AlbumTracks>
        </AlbumViewModal>
      )}
    </AlbumViewWrapper>
  );
};

export default withRouter(AlbumView);
