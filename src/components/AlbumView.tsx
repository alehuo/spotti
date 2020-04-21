import React, { useEffect, useCallback, useState, useRef } from "react";
// @ts-ignore
import ColorThief from "colorthief";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { device } from "../vars";
import {
  getAlbumInfo,
  AlbumResponse,
  AlbumItem,
} from "../services/AlbumService";
import { useTypedSelector } from "../reducers/rootReducer";
import { FormattedTime, trimLength, getTextColor } from "../utils";
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
import { styled } from "../customStyled";
import { TextColor } from "../reducers/uiReducer";

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
  background-color: rgba(0, 0, 0, 0.8);
`;

interface ModalProps {
  textColor: TextColor;
  bgColor: string;
}

const AlbumViewModal = styled.div<ModalProps>`
  width: 90%;
  height: 90%;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.textColor};
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color;
  z-index: 11;
  display: grid;
  grid-template-rows: 192px 42px calc(100% - 42px - 192px);
  @media ${device.mobile} {
    width: 100%;
    height: 100%;
  }
  @media ${device.desktop} {
    width: 70%;
    height: 70%;
    margin-left: auto;
    margin-right: auto;
  }
  @media ${device.uhd} {
    width: 50%;
    height: 60%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const AlbumHeader = styled.div`
  display: grid;
  grid-template-columns: 192px calc(100% - 192px - 42px) 42px;
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

interface AlbumTrackProps {
  bgColor: string;
}

const AlbumTrack = styled.div<AlbumTrackProps>`
  height: 56px;
  width: 100%;
  display: grid;
  grid-template-columns: calc(100% - 64px - 96px) 64px 96px;
  align-content: center;
  align-items: center;
  padding-left: 8px;
  font-size: 0.7em;
  &:nth-child(odd) {
    background-color: ${(props) => props.bgColor + "30"};
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

const CloseButtonWrapper = styled.div`
  padding: 8px;
  width: 100%;
  height: 100%;
  font-size: 0.6em;
  text-align: center;
`;

const ESCAPE_KEY = 27;

interface AlbumViewProps {
  albumId: string;
}

const AlbumView: React.FC<RouteComponentProps<AlbumViewProps>> = ({
  history,
  match,
}) => {
  const dispatch = useDispatch();
  const token = useTypedSelector((state) => state.auth.token);
  const queueItems = useTypedSelector((state) => state.queue.queueItems);
  const [bgColor, setBgColor] = useState([255, 255, 255]);
  const [textColor, setTextColor] = useState<TextColor>("#000000");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const keyDownListener = useCallback(
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
    document.addEventListener("keydown", keyDownListener);
    return () => {
      document.removeEventListener("keydown", keyDownListener);
    };
  }, [keyDownListener]);
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

  const imageCb = useCallback(() => {
    // @ts-ignore
    if (imgRef !== null && imgRef.current !== null) {
      try {
        const colorThief = new ColorThief();
        // @ts-ignore
        const [r, g, b]: [number, number, number] = colorThief.getColor(
          imgRef.current,
          50
        );
        const textColor = getTextColor(r, g, b);
        setBgColor([r, g, b]);
        setTextColor(textColor);
      } catch {}
    }
  }, []);

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
        <AlbumViewModal
          bgColor={`rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`}
          textColor={textColor}
        >
          <AlbumHeader>
            <AlbumImage
              src={albumData.images.find((image) => image.height === 300)?.url}
              alt={albumData.name}
              crossOrigin="anonymous"
              ref={imgRef}
              onLoad={imageCb}
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
            <CloseButtonWrapper>
              <Button
                animate={false}
                style={{ color: textColor }}
                onClick={() => {
                  history.goBack();
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </CloseButtonWrapper>
          </AlbumHeader>
          <AlbumTrackSpacer>
            <b>Tracks ({albumData.total_tracks})</b>
          </AlbumTrackSpacer>
          <AlbumTracks>
            {albumData.tracks.items.map((item) => (
              <AlbumTrack key={item.id} bgColor={textColor}>
                <TrackName>{item.name}</TrackName>
                <TrackDuration>
                  <FormattedTime value={item.duration_ms} />
                </TrackDuration>
                <TrackOptions>
                  {queueItems.length === 0 && (
                    <Button
                      animate={false}
                      style={{ color: textColor }}
                      onClick={() => dispatch(playSong_epic(item.uri, item.id))}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
                  )}
                  <Button
                    animate={false}
                    style={{ color: textColor }}
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
