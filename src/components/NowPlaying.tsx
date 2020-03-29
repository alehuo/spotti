import React, { useState, useEffect, useCallback } from "react";
import { getCurrentlyPlaying } from "../services/PlaybackService";
import { Player } from "./Player";
// @ts-ignore
import ColorThief from "colorthief";
import { setBgColor, setTextColor } from "../reducers/uiReducer";
import { useDispatch } from "react-redux";
import { AppDispatch, useTypedSelector } from "../reducers/rootReducer";
import { getContrast } from "../utils";
import styled from "styled-components";
import { imageWidth, imageHeight, msWidth } from "../vars";
interface Props {
  imgRef: React.Ref<HTMLImageElement>;
}

interface Artist {
  name: string;
}

interface AlbumImage {
  height: number;
  url: string;
  width: number;
}

interface SongData {
  name: string;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
}

const MillisToMinutesAndSeconds: React.FC<{ value: number }> = ({ value }) => {
  const minutes = Math.floor(value / 60000);
  const seconds = parseInt(((value % 60000) / 1000).toFixed(0));
  return (
    <span>
      {minutes}
      {":" + (seconds < 10 ? "0" : "") + seconds}
    </span>
  );
};

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

const AlbumArt = styled.div`
  text-align: left;
  grid-area: albumart;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  img {
    width: ${imageWidth};
    height: ${imageHeight};
  }
`;

const SongData = styled.div`
  grid-area: songdata;
  width: 100%;
  display: grid;
  font-size: 0.8em;
  grid-template-rows: 36px 60px 48px auto;
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
  font-weight: bold;
  grid-area: artist;
  align-self: top;
`;

const SongName = styled.div`
  padding-left: 16px;
  text-align: left;
  align-self: center;
  grid-area: songname;
`;

const PlaybackControls = styled.div`
  padding-left: 16px;
  grid-area: playbackctrl;
  align-self: center;
`;

const ProgressBar = styled.progress`
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
  padding-left: 16px;
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
  const token = useTypedSelector(state => state.auth.token);
  const dispatch: AppDispatch = useDispatch();
  const [albumImages, setAlbumImages] = useState<AlbumImage[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songData, setSongData] = useState<SongData>({
    name: "-",
    progressMs: 0,
    durationMs: 0,
    isPlaying: false
  });
  const getCurrPlaying = useCallback(access_token => {
    getCurrentlyPlaying(access_token).then(res => {
      if (res != null) {
        setAlbumImages([...res.item.album.images]);
        setArtists(res.item.artists);
        setSongData({
          name: res.item.name,
          progressMs: res.progress_ms,
          durationMs: res.item.duration_ms,
          isPlaying: res.is_playing
        });
      }
    });
  }, []);
  useEffect(() => {
    getCurrPlaying(token);
  }, [getCurrPlaying, token]);
  useEffect(() => {
    const interval = setInterval(() => getCurrPlaying(token), 1000 * 10);
    return () => {
      clearInterval(interval);
    };
  }, [getCurrPlaying, token]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        songData.isPlaying &&
        songData.progressMs + 1000 < songData.durationMs
      ) {
        setSongData({ ...songData, progressMs: songData.progressMs + 1000 });
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [songData]);
  return (
    <NowPlayingWrapper>
      <AlbumArt>
        <img
          src={albumImages?.filter(image => image?.height === 300)[0]?.url}
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
      </AlbumArt>
      <SongData>
        <SongArtist>
          <b>{artists.map(artist => artist.name).join(", ")}</b>
        </SongArtist>
        <SongName>{songData.name}</SongName>
        <PlaybackControls>
          <Player />
        </PlaybackControls>
        <CurrentMs>
          <MillisToMinutesAndSeconds value={songData.progressMs} />
        </CurrentMs>
        <ProgressBar
          max="100"
          value={((songData.progressMs / songData.durationMs) * 100).toFixed(0)}
        />
        <DurationMs>
          <MillisToMinutesAndSeconds value={songData.durationMs} />
        </DurationMs>
      </SongData>
    </NowPlayingWrapper>
  );
};
