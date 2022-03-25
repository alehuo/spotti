import React, { useCallback, useEffect, useState } from "react";
import { setActiveDevice } from "../services/DeviceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faPauseCircle } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { changeVolume } from "../services/PlaybackService";
import { useTypedSelector } from "../reducers/rootReducer";
import { AppDispatch } from "../configureStore";
import { Button } from "./ui/Button";
import { styled } from "../customStyled";
import { useDispatch } from "react-redux";
import {
  PlayerStatus,
  continuePlayback,
  pausePlayback,
  setDeviceId,
  setVolume,
  clearAllPlayerData,
} from "../reducers/playerReducer";
import { setToken } from "../reducers/authReducer";

const VolumeSlider = styled.input`
  grid-area: volume;
  -webkit-appearance: none;
  min-width: 80px;
  width: calc(95% / 3);
  align-self: center;
  align-content: center;
  border-radius: 5px;
  outline: none;
  margin-left: 2.5%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  height: 10px;
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: background-color;
  background-color: ${(props) => props.theme.textColor + "75"};

  ::-webkit-slider-thumb {
    transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color;
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.textColor};
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.customColors.green1};
    }
  }

  ::-moz-range-thumb {
    transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.textColor};
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.customColors.green1};
    }
  }

  ::-moz-range-progress {
    background: ${(props) => props.theme.textColor};
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
    changeVolume(token, volume, deviceId).catch((err) => console.error(err));
  },
  700,
  {
    leading: false,
    trailing: true,
  }
);

export const Player: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useTypedSelector((state) => state.auth.token);
  const status = useTypedSelector((state) => state.player.playerStatus);
  const deviceId = useTypedSelector((state) => state.player.deviceId);

  const [player, setPlayer] = useState<any>(null);
  const volume = useTypedSelector((state) => state.player.volumePercent);
  const [connected, setConnected] = useState(false);
  const initClient = useCallback(() => {
    // @ts-ignore
    const player = new Spotify.Player({
      name: "Spotti",
      getOAuthToken: (cb: (_token: string) => void) => {
        cb(token);
      },
      volume: 0.5,
    });
    // @ts-ignore
    player.on("initialization_error", ({ message }) => {
      console.error("Failed to initialize", message);
    });
    // @ts-ignore
    player.on("authentication_error", ({ message }) => {
      localStorage.removeItem("spotify_token");
      dispatch(setToken(""));
      dispatch(clearAllPlayerData());
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
    return (
      <PlayerWrapper style={{ padding: 16 }}>Loading player...</PlayerWrapper>
    );
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
