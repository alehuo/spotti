import React, { useEffect, useState, useCallback } from "react";
import "./Playlists.scss";
import { Playlist, fetchPlaylists } from "../services/PlaylistService";
import { startPlaying } from "../services/PlaybackService";

interface Props {
  token: string;
}

export const Playlists: React.FC<Props> = ({ token }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const startPlaylist = useCallback(
    playlistId => {
      startPlaying(token, `spotify:playlist:${playlistId}`);
    },
    [token]
  );
  useEffect(() => {
    fetchPlaylists(token).then(playlists => setPlaylists([...playlists]));
  }, [token]);
  return (
    <div className="playlists">
      {playlists.map(playlist => (
        <div
          className="playlist"
          key={playlist.id}
          onClick={() => startPlaylist(playlist.id)}
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
