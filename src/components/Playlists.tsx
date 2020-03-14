import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Playlists.scss";

interface Props {
  token: string;
}

interface Img {
  height: number | null;
  width: number | null;
  url: string;
}

interface Playlist {
  collaborative: boolean;
  description: string;
  id: string;
  images: Img[];
  name: string;
  primary_color: null | string;
  public: boolean;
  tracks: {
    href: string;
    total: number;
  };
}

export const Playlists: React.FC<Props> = ({ token }) => {
  const startPlaying = useCallback(
    async (playlistId: string) => {
      await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        {
          context_uri: `spotify:playlist:${playlistId}`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    },
    [token]
  );
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  useEffect(() => {
    axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setPlaylists([...res.data.items]);
      });
  }, [token]);
  return (
    <div className="playlists">
      {playlists.map(playlist => (
        <div
          className="playlist"
          key={playlist.id}
          onClick={() => {
            startPlaying(playlist.id);
          }}
        >
          <div className="playlist-img">
            <img src={playlist.images[0]?.url} alt="" />
          </div>
          <span className="playlist-name">{playlist.name}</span>{" "}
          <span className="playlist-tracks">
            {playlist.tracks.total === 1
              ? "1 track"
              : playlist.tracks.total + " tracks"}
          </span>
        </div>
      ))}
    </div>
  );
};
