import React, { useEffect } from "react";
import queryString from "query-string";
import "./App.scss";
import { NowPlaying } from "./components/NowPlaying";
import { Playlists } from "./components/Playlists";
import { Queue } from "./components/Queue";
import { Search } from "./components/Search";
import { useDispatch } from "react-redux";
import { AppDispatch, useTypedSelector } from "./reducers/rootReducer";
import { setToken } from "./reducers/authReducer";

const authUrl = "https://accounts.spotify.com/authorize";
const query = queryString.stringify(
  {
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
    scope: process.env.REACT_APP_SPOTIFY_SCOPES,
    response_type: "token"
  },
  { arrayFormat: "bracket" }
);
const url = `${authUrl}?${query}`;
const imgRef = React.createRef<HTMLImageElement>();

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector(state => state.auth.token);
  const bgColor = useTypedSelector(state => state.ui.bgColor);
  useEffect(() => {
    const qry = queryString.parse(window.location.hash.substring(1));
    window.location.hash = "";
    let _token = qry.access_token;
    if (_token) {
      if (!Array.isArray(_token)) {
        dispatch(setToken(_token));
      }
    }
  }, [dispatch]);

  return (
    <div
      className="App"
      style={{
        backgroundColor: bgColor
      }}
    >
      {token === "" ? (
        <a href={url} className="authorize-link">
          Authorize Spotify
        </a>
      ) : (
        <>
          <NowPlaying imgRef={imgRef} />
          <Playlists />
          <Queue />
          <Search />
        </>
      )}
    </div>
  );
};

export default App;
