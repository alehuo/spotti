import React, { useCallback, useEffect, useState } from "react";
import { setActiveDevice } from "../services/DeviceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faPauseCircle } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { changeVolume } from "../services/PlaybackService";
import { useTypedSelector, AppDispatch } from "../reducers/rootReducer";
import { Button } from "./ui/Button";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  PlayerStatus,
  continuePlayback,
  pausePlayback,
  setDeviceId,
  setVolume
} from "../reducers/playerReducer";

const VolumeSlider = styled.input`
  grid-area: volume;
  -webkit-appearance: none;
  width: 100%;
  align-self: center;
  align-content: center;
  border-radius: 5px;
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  background: rgba(0, 0, 0, 0.4);
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  height: 10px;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.theme.white1};
    cursor: pointer;
    &:hover {
      background: ${props => props.theme.green1};
    }
  }

  ::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.theme.white1};
    cursor: pointer;
    &:hover {
      background: ${props => props.theme.green1};
    }
  }

  ::-moz-range-progress {
    background: ${props => props.theme.white1};
  }
`;
const PlayerWrapper = styled.div`
  display: grid;
  grid-template-columns: 60px calc(100% - 120px) 60px;
  grid-template-areas: "playpause volume misc";
  width: 100%;
  height: 100%;
`;

const debouncedVolumeChange = debounce(
  (token: string, volume: number, deviceId: string) => {
    console.log("Called");
    changeVolume(token, volume, deviceId).catch(err => console.error(err));
  },
  700,
  {
    leading: false,
    trailing: true
  }
);

export const Player: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector(state => state.auth.token);
  const status = useTypedSelector(state => state.player.playerStatus);
  const deviceId = useTypedSelector(state => state.player.deviceId);

  const [player, setPlayer] = useState<any>(null);
  const volume = useTypedSelector(state => state.player.volumePercent);
  const [connected, setConnected] = useState(false);
  const initClient = useCallback(() => {
    // @ts-ignore
    const player = new Spotify.Player({
      name: "Spotify Web Player",
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token);
      },
      volume: 0.5
    });
    // @ts-ignore
    player.on("initialization_error", ({ message }) => {
      console.error("Failed to initialize", message);
    });
    // @ts-ignore
    player.on("authentication_error", ({ message }) => {
      console.error("Failed to authenticate", message);
    });
    // @ts-ignore
    player.addListener("ready", ({ device_id }) => {
      dispatch(setDeviceId(device_id));
    });
    player.connect().then((connected: boolean) => {
      if (connected) {
        setConnected(true);
        console.log("Connected");
      } else {
        console.error("Failed to connect");
      }
    });

    setPlayer(player);
    return () => {
      player.removeListener("ready");
      player.disconnect();
      setPlayer(null);
      setConnected(false);
      dispatch(setDeviceId(""));
    };
  }, [dispatch, token]);

  // Set the active device
  useEffect(() => {
    async function activeDeviceHandler() {
      if (deviceId !== "") {
        await setActiveDevice(token, deviceId);
      }
    }
    activeDeviceHandler();
  }, [deviceId, token]);

  // @ts-ignore
  window.onSpotifyWebPlaybackSDKReady = initClient;
  // Inject script
  useEffect(() => {
    // @ts-ignore
    if (!window.Spotify) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://sdk.scdn.co/spotify-player.js";
      document.head.appendChild(scriptTag);
    }
  }, []);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      dispatch(setVolume(Number(e.target.value)));
      debouncedVolumeChange(token, Number(e.target.value), deviceId);
    },
    [dispatch, deviceId, token]
  );

  if (player == null || !connected || deviceId === "") {
    return <PlayerWrapper>Loading player...</PlayerWrapper>;
  }
  return (
    <PlayerWrapper>
      {(status === PlayerStatus.PAUSED || status === PlayerStatus.INITIAL) && (
        <Button
          style={{ gridArea: "playpause" }}
          onClick={() => dispatch(continuePlayback())}
        >
          <FontAwesomeIcon icon={faPlayCircle} />
        </Button>
      )}
      {status === PlayerStatus.PLAYING && (
        <Button
          style={{ gridArea: "playpause" }}
          onClick={() => dispatch(pausePlayback())}
        >
          <FontAwesomeIcon icon={faPauseCircle} />
        </Button>
      )}
      <VolumeSlider
        type="range"
        step="1"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
      />
    </PlayerWrapper>
  );
};
