import React, { useEffect } from "react";
import queryString from "query-string";
import { NowPlaying } from "./components/NowPlaying";
import { Playlists } from "./components/Playlists";
import { Queue } from "./components/Queue";
import { Search } from "./components/Search";
import { useDispatch } from "react-redux";
import { AppDispatch, useTypedSelector } from "./reducers/rootReducer";
import styled, { ThemeProvider } from "styled-components";
import { appWidth, nowPlayingHeight, appHeight } from "./vars";
import { Authorize } from "./components/Authorize";
import { Helmet } from "react-helmet";
import { initApp_epic } from "./reducers/uiReducer";

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
    "playlist search"
    "playlist search"
    "playlist search"
    "playlist search";
`;

const defaultTheme = {
  bgColor: "#D87260",
  color: "white",
  green1: "rgb(80, 217, 80)",
  darkBlue1: "rgb(6, 7, 15)",
  black1: "black",
  white1: "white"
};

const imgRef = React.createRef<HTMLImageElement>();

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector(state => state.auth.token);
  const bgColor = useTypedSelector(state => state.ui.bgColor);
  const textColor = useTypedSelector(state => state.ui.textColor);
  const songData = useTypedSelector(state => state.player.songData);
  useEffect(() => {
    const qry = queryString.parse(window.location.hash.substring(1));
    window.location.hash = "";
    let _token = qry.access_token;
    if (_token) {
      if (!Array.isArray(_token)) {
        dispatch(initApp_epic(_token));
      }
    }
  }, [dispatch]);

  return (
    <ThemeProvider
      theme={{
        ...defaultTheme,
        ...{
          bgColor,
          textColor
        }
      }}
    >
      <AppWrapper>
        <>
          {token === "" ? (
            <Authorize />
          ) : (
            <>
              <NowPlaying imgRef={imgRef} />
              <Playlists />
              <Queue />
              <Search />
            </>
          )}
          {songData !== null ? (
            <Helmet>
              <title>
                {songData?.artists?.map(artist => artist.name).join(", ") +
                  " - " +
                  songData?.name}
              </title>
            </Helmet>
          ) : (
            <Helmet>
              <title>Spotti</title>
            </Helmet>
          )}
        </>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App;
