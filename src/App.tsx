import React, { useEffect } from "react";
import queryString from "query-string";
import { NowPlaying } from "./components/NowPlaying";
import { Queue } from "./components/Queue";
import { Search } from "./components/Search";
import { useDispatch } from "react-redux";
import { AppDispatch, useTypedSelector } from "./reducers/rootReducer";
import styled, { ThemeProvider } from "styled-components";
import { appWidth, nowPlayingHeight, appHeight, device } from "./vars";
import { Authorize } from "./components/Authorize";
import { Helmet } from "react-helmet";
import { initApp_epic } from "./reducers/uiReducer";

const AppWrapper = styled.div`
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  width: ${appWidth};
  height: ${appHeight};
`;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(450px, 600px) 1fr;
  grid-template-rows: ${nowPlayingHeight} calc(100% - ${nowPlayingHeight});
  grid-template-areas:
    "nowplaying queue"
    "search search";
  height: 100%;
  @media ${device.desktop} {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }
  @media ${device.uhd} {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const defaultTheme = {
  bgColor: "#D87260",
  color: "white",
  green1: "rgb(80, 217, 80)",
  darkBlue1: "rgb(6, 7, 15)",
  black1: "black",
  white1: "white",
};

const imgRef = React.createRef<HTMLImageElement>();

const App = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector((state) => state.auth.token);
  const bgColor = useTypedSelector((state) => state.ui.bgColor);
  const textColor = useTypedSelector((state) => state.ui.textColor);
  const songData = useTypedSelector((state) => state.player.songData);
  useEffect(() => {
    const qry = queryString.parse(window.location.hash.substring(1));
    window.location.hash = "";
    const _token = qry.access_token;

    const storageToken = localStorage.getItem("spotify_token");
    if (storageToken === null) {
      if (_token && !Array.isArray(_token)) {
        localStorage.setItem("spotify_token", _token);
        dispatch(initApp_epic(_token));
      }
    } else {
      dispatch(initApp_epic(storageToken));
    }
  }, [dispatch]);

  return (
    <ThemeProvider
      theme={{
        ...defaultTheme,
        ...{
          bgColor,
          textColor,
        },
      }}
    >
      <AppWrapper>
        <AppGrid>
          {token === "" ? (
            <Authorize />
          ) : (
              <>
                <NowPlaying imgRef={imgRef} />
                <Queue />
                <Search />
              </>
            )}
          {songData !== null ? (
            <Helmet>
              <title>
                {songData?.artists?.map((artist) => artist.name).join(", ") +
                  " - " +
                  songData?.name}
              </title>
            </Helmet>
          ) : (
              <Helmet>
                <title>Spotti</title>
              </Helmet>
            )}
        </AppGrid>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App;
