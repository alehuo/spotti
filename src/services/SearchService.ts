import { customAxios } from "../api/customAxios";

export interface ExternalUrls {
  spotify: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls2 {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls2;
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

export interface ExternalUrls3 {
  spotify: string;
}

export interface Artist2 {
  external_urls: ExternalUrls3;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalIds {
  isrc: string;
}

export interface ExternalUrls4 {
  spotify: string;
}

export interface Item {
  album: Album;
  artists: Artist2[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls4;
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

export interface Tracks {
  href: string;
  items: Item[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

export interface RootObject {
  tracks: Tracks;
}

export const searchTracks = async (token: string, searchTerm: string) => {
  const res = await customAxios(token).get<RootObject>(
    "https://api.spotify.com/v1/search",
    {
      params: {
        q: searchTerm,
        type: "track",
        limit: 50
      }
    }
  );
  return res;
};

export const searchAlbums = async (token: string, searchTerm: string) => {
  const res = await customAxios(token).get<RootObject>(
    "https://api.spotify.com/v1/search",
    {
      params: {
        q: searchTerm,
        type: "album",
        limit: 50
      }
    }
  );
  return res;
};

export const getTrack = async (token: string, id: string) => {
  const res = await customAxios(token).get<Item>(
    `https://api.spotify.com/v1/tracks/${id}`
  );
  return res;
};
