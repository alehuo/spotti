import { customAxios } from "../api/customAxios";

interface ExternalUrls {
  spotify: string;
}

interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

interface ExternalUrls2 {
  spotify: string;
}

interface Artist {
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface ExternalUrls3 {
  spotify: string;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls3;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface ExternalUrls4 {
  spotify: string;
}

interface Artist2 {
  external_urls: ExternalUrls4;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface ExternalIds {
  isrc: string;
}

interface ExternalUrls5 {
  spotify: string;
}

interface Item {
  album: Album;
  artists: Artist2[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls5;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

interface Disallows {
  resuming: boolean;
  skipping_prev: boolean;
}

interface Actions {
  disallows: Disallows;
}

interface RootObject {
  timestamp: number;
  context: Context;
  progress_ms: number;
  item: Item;
  currently_playing_type: string;
  actions: Actions;
  is_playing: boolean;
}

export interface Device {
  id: string;
  is_active: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface PlayerDisallows {
  resuming: boolean;
}

export interface PlayerActions {
  disallows: PlayerDisallows;
}

export interface PlayerItem {}

export interface PlayerExternalUrls {
  spotify: string;
}

export interface PlayerContext {
  external_urls: PlayerExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface PlayerStatus {
  timestamp: number;
  device: Device;
  progress_ms: string;
  is_playing: boolean;
  currently_playing_type: string;
  actions: PlayerActions;
  item: PlayerItem;
  shuffle_state: boolean;
  repeat_state: string;
  context: PlayerContext;
}

export const startPlayingPlaylist = async (
  token: string,
  contextUri: string
) => {
  const res = await customAxios(token).put(
    "https://api.spotify.com/v1/me/player/play",
    {
      context_uri: contextUri
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res;
};

export const startPlayingTrack = async (
  token: string,
  trackContextUri: string
) => {
  const res = await customAxios(token).put(
    "https://api.spotify.com/v1/me/player/play",
    {
      uris: [trackContextUri]
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res;
};

export const getCurrentlyPlaying = async (token: string) => {
  const res = await customAxios(token).get<RootObject>(
    "https://api.spotify.com/v1/me/player/currently-playing"
  );
  return res;
};

export const getPlayerStatus = async (token: string) => {
  const res = await customAxios(token).get<PlayerStatus>(
    "https://api.spotify.com/v1/me/player"
  );
  return res;
};

export const addToQueue = async (token: string, trackUri: string) => {
  const res = await customAxios(token).post(
    "https://api.spotify.com/v1/me/player/queue",
    null,
    {
      params: {
        uri: trackUri
      }
    }
  );
  return res;
};

export const pausePlayback = async (token: string, device_id: string) => {
  const res = await customAxios(token).put(
    "https://api.spotify.com/v1/me/player/pause",
    null,
    {
      params: {
        device_id
      }
    }
  );
  return res;
};

export const continuePlayback = async (token: string, device_id: string) => {
  const res = await customAxios(token).put(
    "https://api.spotify.com/v1/me/player/play",
    null,
    {
      params: {
        device_id
      }
    }
  );
  return res;
};

export const changeVolume = async (
  token: string,
  volume_percent: number,
  device_id: string
) => {
  const res1 = await customAxios(token).put(
    "https://api.spotify.com/v1/me/player/volume",
    null,
    {
      params: {
        device_id,
        volume_percent
      }
    }
  );
  if (res1.status !== 204) {
    throw new Error(`Volume change failed with status code ${res1.status}`);
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
  const res2 = await customAxios(token).get(
    "https://api.spotify.com/v1/me/player"
  );
  if (res2.data.device === undefined) {
    throw new Error("Device is not defined");
  }
  if (res2.data.device.volume_percent !== volume_percent) {
    throw new Error(
      `Volume was not changed properly. Requested ${volume_percent}, was ${res2.data.device.volume_percent}`
    );
  }
};
