import React, { useCallback, useEffect, useState } from "react";
import { setActiveDevice } from "../services/DeviceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faPauseCircle } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { changeVolume } from "../services/PlaybackService";
import { useTypedSelector } from "../reducers/rootReducer";
import { Button } from "./ui/Button";
import styled from "styled-components";

const VolumeSlider = styled.input``;
const PlayerWrapper = styled.div`
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
  const token = useTypedSelector(state => state.auth.token);
  const [player, setPlayer] = useState<any>(null);
  const [volume, setVolume] = useState(50);
  const [connected, setConnected] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [playing, setPlaying] = useState<"playing" | "paused">("paused");
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
      console.log("The Web Playback SDK is ready to play music!");
      console.log("Device ID", device_id);
      setDeviceId(device_id);
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
      setDeviceId("");
    };
  }, [token]);

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

  const changePlayingState = useCallback(
    (playingState: "paused" | "playing") => {
      if (playingState === "playing") {
        player.resume().then(() => {
          setPlaying(playingState);
        });
      } else {
        player.pause().then(() => {
          setPlaying(playingState);
        });
      }
    },
    [player]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setVolume(Number(e.target.value));
      debouncedVolumeChange(token, Number(e.target.value), deviceId);
    },
    [deviceId, token]
  );

  if (player == null || !connected || deviceId === "") {
    return <PlayerWrapper>Loading player...</PlayerWrapper>;
  }
  return (
    <PlayerWrapper>
      {playing === "paused" && (
        <Button onClick={() => changePlayingState("playing")}>
          <FontAwesomeIcon icon={faPlayCircle} />
        </Button>
      )}
      {playing === "playing" && (
        <Button onClick={() => changePlayingState("paused")}>
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
