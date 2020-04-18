import React, { useEffect } from "react";
import { Player } from "./Player";
// @ts-ignore
import ColorThief from "colorthief";
import { setBgColor, setTextColor } from "../reducers/uiReducer";
import { useDispatch } from "react-redux";
import { AppDispatch, useTypedSelector } from "../reducers/rootReducer";
import { getContrast, trimLength, MillisToMinutesAndSeconds } from "../utils";
import { styled } from "../customStyled";
import { imageWidth, imageHeight, msWidth } from "../vars";
import {
  PlayerStatus,
  setCurrentMs,
  setCurrentTrack_epic,
} from "../reducers/playerReducer";
import { Disc } from "./ui/Disc";
interface Props {
  imgRef: React.Ref<HTMLImageElement>;
}

const NowPlayingWrapper = styled.div`
  padding: 16px;
  grid-area: nowplaying;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: ${imageWidth} 1fr;
  grid-template-rows: ${imageHeight} 1fr 1fr;
  grid-template-areas:
    "albumart songdata"
    "albumart songdata"
    "albumart songdata";
`;

const AlbumArt = styled.img`
  height: 100%;
  width: auto;
  object-fit: contain;
  grid-area: albumart;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const SongData = styled.div`
  grid-area: songdata;
  width: 100%;
  height: 100%;
  display: grid;
  font-size: 0.8em;
  grid-template-rows: 1fr 1fr 1fr 1fr auto;
  grid-template-columns: ${msWidth} calc(100% - ${msWidth} * 2) ${msWidth};
  grid-template-areas:
    "songname songname songname"
    "artist artist artist"
    "playbackctrl playbackctrl playbackctrl"
    "currentms progressbar durationms";
`;

const SongArtist = styled.div`
  padding-left: 16px;
  text-align: left;
  grid-area: artist;
  align-self: top;
`;

const SongName = styled.div`
  padding-left: 16px;
  text-align: left;
  align-self: center;
  font-weight: bold;
  grid-area: songname;
`;

const PlaybackControls = styled.div`
  grid-area: playbackctrl;
  align-self: center;
`;

const ProgressBar = styled.progress`
  &[value] {
    -webkit-appearance: none;
    appearance: none;
    height: 10px;
  }
  &[value]::-webkit-progress-value {
    border-radius: 5px;
    background-color: ${(props) => props.theme.textColor};
    transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color;
  }
  &[value]::-webkit-progress-bar {
    border-radius: 5px;
    transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color;
    background-color: ${(props) => props.theme.textColor + "75"};
  }

  grid-area: progressbar;
  align-self: center;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  height: 10px;
  border-radius: 5px;
`;

const CurrentMs = styled.div`
  text-align: center;
  grid-area: currentms;
  align-self: center;
`;

const DurationMs = styled.div`
  text-align: left;
  grid-area: durationms;
  align-self: center;
`;

export const NowPlaying: React.FC<Props> = ({ imgRef }) => {
  const status = useTypedSelector((state) => state.player.playerStatus);
  const songData = useTypedSelector((state) => state.player.songData);
  const currentMs = useTypedSelector((state) => state.player.currentMs);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(
      () => dispatch(setCurrentTrack_epic()),
      1000 * 5
    );
    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        status === PlayerStatus.PLAYING &&
        songData !== null &&
        currentMs + 1000 < songData.duration_ms
      ) {
        dispatch(setCurrentMs(currentMs + 1000));
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [currentMs, dispatch, songData, status]);
  return (
    <NowPlayingWrapper>
      <AlbumArt
        src={
          songData
            ? songData.album?.images?.filter((image) => image.height === 300)[0]
                ?.url
            : process.env.PUBLIC_URL + "/default_album.jpg"
        }
        ref={imgRef}
        crossOrigin="anonymous"
        alt="Album art"
        onLoad={() => {
          // @ts-ignore
          if (imgRef !== null && imgRef.current !== null) {
            const colorThief = new ColorThief();
            // @ts-ignore
            const color = colorThief.getColor(imgRef.current, 50);
            dispatch(setBgColor(`rgb(${color[0]},${color[1]},${color[2]})`));
            dispatch(setTextColor(getContrast(color[0], color[1], color[2])));
          }
        }}
      />
      <SongData>
        <SongArtist>
          {trimLength(
            songData?.artists?.map((artist) => artist.name).join(", ")
          )}
        </SongArtist>
        <SongName>
          {trimLength(songData?.name)}
          {songData && (
            <>
              &nbsp;&nbsp;&nbsp;
              <Disc rotating={status === PlayerStatus.PLAYING} />
            </>
          )}
        </SongName>
        <PlaybackControls>
          <Player />
        </PlaybackControls>
        <CurrentMs>
          <MillisToMinutesAndSeconds value={currentMs} />
        </CurrentMs>
        <ProgressBar
          max="100"
          value={(
            (currentMs / (songData?.duration_ms || currentMs)) *
            100
          ).toFixed(0)}
        />
        <DurationMs>
          <MillisToMinutesAndSeconds value={songData?.duration_ms || 0} />
        </DurationMs>
      </SongData>
    </NowPlayingWrapper>
  );
};
