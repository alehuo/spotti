import React, { useCallback, useEffect } from "react";

interface Props {
  token: string;
}

export const Player: React.FC<Props> = ({ token }) => {
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
    });
    player.connect().then((connected: boolean) => {
      if (connected) {
        console.log("Connected");
      } else {
        console.error("Failed to connect");
      }
    });
    return () => {
      player.removeListener("ready");
      player.disconnect();
    };
  }, [token]);
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
  return null;
};
