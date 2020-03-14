import React, { useState, useEffect } from "react";
import axios from "axios";

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
}

function millisToMinutesAndSeconds(millis: number) {
  var minutes = Math.floor(millis / 60000);
  var seconds = parseInt(((millis % 60000) / 1000).toFixed(0));
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export const NextTrack: React.FC<Props> = ({ token }) => {
  const [albumImages, setAlbumImages] = useState<AlbumImage[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [songData, setSongData] = useState<SongData>({
    name: "",
    progressMs: 0,
    durationMs: 0
  });
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          console.log(res.data);
          setAlbumImages([...res.data.item.album.images]);
          setArtists(res.data.item.artists);
          setSongData({
            name: res.data.item.name,
            progressMs: res.data.progress_ms,
            durationMs: res.data.item.duration_ms
          });
        });
    }, 1000 * 20);
    return () => {
      clearInterval(interval);
    };
  }, [token]);
  return (
    <div>
      <p>
        <img
          src={albumImages?.filter(image => image?.height === 300)[0]?.url}
          alt=""
        />
      </p>
      <p>
        {artists.map(artist => (
          <span key={artist.name}>{artist.name}</span>
        ))}{" "}
        - {songData.name}
      </p>
      <p>
        {millisToMinutesAndSeconds(songData.progressMs)}{" "}
        <progress
          max="100"
          value={((songData.progressMs / songData.durationMs) * 100).toFixed(0)}
        ></progress>{" "}
        {millisToMinutesAndSeconds(songData.durationMs)}
      </p>
    </div>
  );
};
