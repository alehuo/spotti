import React, { useEffect } from "react";
import queryString from "query-string";
import { NowPlaying } from "./components/NowPlaying";
import { Queue } from "./components/Queue";
import { Search } from "./components/Search";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "./reducers/rootReducer";
import { AppDispatch } from "./configureStore";
import { ThemeProvider } from "styled-components";
import { appWidth, nowPlayingHeight, appHeight, device } from "./vars";
import { Authorize } from "./components/Authorize";
import { Helmet } from "react-helmet";
import { initApp_epic } from "./reducers/uiReducer";
import { styled, defaultTheme } from "./customStyled";
import { Route, Switch } from "react-router-dom";
import AlbumView from "./components/AlbumView";

interface AppWrapperProps {
  authPage: boolean;
}

const AppWrapper = styled.div<AppWrapperProps>`
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color, color;
  ${(props) =>
    props.authPage
      ? `background: linear-gradient(90deg, #d53369 0%, #daae51 100%);`
      : `background-color: ${props.theme.bgColor};`}
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
  @media ${device.mobile} {
    width: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 160px 160px calc(100% - 160px - 160px);
    grid-template-areas:
      "nowplaying"
      "queue"
      "search";
  }
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
      <AppWrapper authPage={token === ""}>
        <AppGrid>
          {token === "" ? (
            <Authorize />
          ) : (
            <>
              <Switch>
                <Route exact path="/album/:albumId">
                  <AlbumView />
                </Route>
                <Route exact path="/playlist/:playlistId">
                  <div>Coming soon</div>
                </Route>
                <Route />
              </Switch>
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
