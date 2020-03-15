import React, { useState, useEffect } from "react";
import queryString from "query-string";
import "./App.scss";
import { NowPlaying } from "./components/NowPlaying";
import { Playlists } from "./components/Playlists";
import { Queue } from "./components/Queue";
import { Search } from "./components/Search";

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

const App = () => {
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token !== null) {
      setToken(token);
    } else {
      const qry = queryString.parse(window.location.hash.substring(1));
      window.location.hash = "";
      let _token = qry.access_token;
      if (_token) {
        if (!Array.isArray(_token)) {
          // Set token
          localStorage.setItem("spotify_token", _token);
          setToken(_token);
        }
      }
    }
  }, []);

  return (
    <div className="App">
      {token === "" ? (
        <a href={url} className="authorize-link">
          Authorize Spotify
        </a>
      ) : (
        <>
          <NowPlaying token={token} />
          <Playlists token={token} />
          <Queue token={token} />
          <Search token={token} />
        </>
      )}
    </div>
  );
};

export default App;
