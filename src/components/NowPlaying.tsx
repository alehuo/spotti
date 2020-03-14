import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NowPlaying.scss";
interface Props {
  token: string;
}

interface AlbumImage {
  height: number;
  url: string;
  width: number;
}

interface Artist {
  name: string;
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

export const NowPlaying: React.FC<Props> = ({ token }) => {
  const [albumImages, setAlbumImages] = useState<AlbumImage[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songData, setSongData] = useState<SongData>({
    name: "",
    progressMs: 0,
    durationMs: 0,
    isPlaying: false
  });
  useEffect(() => {
    axios
      .get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setAlbumImages([...res.data.item.album.images]);
        setArtists(res.data.item.artists);
        setSongData({
          name: res.data.item.name,
          progressMs: res.data.progress_ms,
          durationMs: res.data.item.duration_ms,
          isPlaying: res.data.is_playing
        });
      });
  }, [token]);
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setAlbumImages([...res.data.item.album.images]);
          setArtists(res.data.item.artists);
          setSongData({
            name: res.data.item.name,
            progressMs: res.data.progress_ms,
            durationMs: res.data.item.duration_ms,
            isPlaying: res.data.is_playing
          });
        });
    }, 1000 * 5);
    return () => {
      clearInterval(interval);
    };
  }, [token]);
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
    <div className="now-playing">
      <div className="album-art">
        <img
          src={albumImages?.filter(image => image?.height === 300)[0]?.url}
          alt=""
        />
      </div>
      <div className="song-data">
        <div className="song-artist">
          <b>{artists.map(artist => artist.name).join(", ")}</b>
        </div>
        <div className="song-name">{songData.name}</div>
        <div className="song-progress-currentms">
          {<MillisToMinutesAndSeconds value={songData.progressMs} />}
        </div>
        <progress
          className="song-progress-progressbar"
          max="100"
          value={((songData.progressMs / songData.durationMs) * 100).toFixed(0)}
        ></progress>
        <div className="song-progress-durationms">
          {<MillisToMinutesAndSeconds value={songData.durationMs} />}
        </div>
      </div>
    </div>
  );
};
