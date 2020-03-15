import React, { useCallback, useEffect, useState } from "react";
import { setActiveDevice } from "../services/DeviceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faPauseCircle } from "@fortawesome/free-solid-svg-icons";
import "./Player.scss";

interface Props {
  token: string;
}

export const Player: React.FC<Props> = ({ token }) => {
  const [player, setPlayer] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [playing, setPlaying] = useState<"playing" | "paused">("paused");
  const initClient = useCallback(() => {
    console.log("Spotify SDK ready");
    // @ts-ignore
    const player = new Spotify.Player({
      name: "Spotify Web Player (alehuo)",
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token);
      },
      onPlayerStateChanged: (playerState: any) => {
        console.log("Player state changed:", playerState);
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
  useEffect(() => {
    if (deviceId !== "") {
      setActiveDevice(token, deviceId);
    }
  }, [deviceId, token]);
  // @ts-ignore
  window.onSpotifyWebPlaybackSDKReady = initClient;
  useEffect(() => {
    // @ts-ignore
    if (!window.Spotify) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://sdk.scdn.co/spotify-player.js";
      document.head.appendChild(scriptTag);
    }
  }, []);
  const pause = useCallback(() => {
    setPlaying("paused");
    player.pause();
  }, [player]);
  const play = useCallback(() => {
    setPlaying("playing");
    player.resume();
  }, [player]);
  if (player == null) {
    return <div />;
  }
  return (
    <div className="player">
      {playing === "paused" && connected && (
        <button className="btn" onClick={() => play()}>
          <FontAwesomeIcon icon={faPlayCircle} />
        </button>
      )}
      {playing === "playing" && connected && (
        <button className="btn" onClick={() => pause()}>
          <FontAwesomeIcon icon={faPauseCircle} />
        </button>
      )}
    </div>
  );
};
