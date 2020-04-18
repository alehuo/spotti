import React, { useEffect, useCallback } from "react";
import "./Playlists.scss";
import { fetchPlaylists } from "../services/PlaylistService";
import { useTypedSelector } from "../reducers/rootReducer";
import { setPlaylists } from "../reducers/playlistReducer";
import { useDispatch } from "react-redux";
import { playPlaylist } from "../reducers/playerReducer";
import { AppDispatch } from "../configureStore";

export const Playlists: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector((state) => state.auth.token);
  const playlists = useTypedSelector((state) => state.playlist.playlists);
  const startPlaylist = useCallback(
    (playlistId) => {
      dispatch(playPlaylist(`spotify:playlist:${playlistId}`));
    },
    [dispatch]
  );
  useEffect(() => {
    fetchPlaylists(token).then((playlists) =>
      dispatch(setPlaylists([...playlists]))
    );
  }, [token, dispatch]);
  return (
    <div className="playlists">
      <div className="playlists-bar">Your playlists</div>
      <div className="playlist-results">
        {playlists.map((playlist) => (
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
    </div>
  );
};
