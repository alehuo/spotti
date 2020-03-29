import React, { useEffect } from "react";
import queryString from "query-string";
import { NowPlaying } from "./components/NowPlaying";
import { Playlists } from "./components/Playlists";
import { Queue } from "./components/Queue";
import { Search } from "./components/Search";
import { useDispatch } from "react-redux";
import { AppDispatch, useTypedSelector } from "./reducers/rootReducer";
import { setToken } from "./reducers/authReducer";
import styled, { ThemeProvider } from "styled-components";
import { appWidth, nowPlayingHeight, appHeight } from "./vars";
import { authUrl } from "./services/AuthService";

const AppWrapper = styled.div`
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color;
  background-color: ${props => props.theme.bgColor};
  color: ${props => props.theme.textColor};
  box-sizing: border-box;
  width: ${appWidth};
  height: ${appHeight};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: ${nowPlayingHeight} 1fr 1fr 1fr;
  grid-template-areas:
    "nowplaying queue"
    "playlist queue"
    "playlist search"
    "playlist search"
    "playlist search";
`;

AppWrapper.defaultProps = {
  theme: {
    bgColor: "black",
    color: "white"
  }
};

const AuthorizeLink = styled.a`
  color: white;
  padding: 16px;
  text-decoration: none;
  &:visited,
  :active,
  :hover {
    color: white;
  }
`;

const imgRef = React.createRef<HTMLImageElement>();

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector(state => state.auth.token);
  const bgColor = useTypedSelector(state => state.ui.bgColor);
  const textColor = useTypedSelector(state => state.ui.textColor);
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
    <ThemeProvider
      theme={{
        bgColor,
        textColor
      }}
    >
      <AppWrapper>
        {token === "" ? (
          <AuthorizeLink href={authUrl}>Authorize Spotify</AuthorizeLink>
        ) : (
          <>
            <NowPlaying imgRef={imgRef} />
            <Playlists />
            <Queue />
            <Search />
          </>
        )}
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App;
