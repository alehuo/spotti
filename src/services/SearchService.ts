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

export interface ExternalIds {
  isrc: string;
}

export interface ExternalUrls4 {
  spotify: string;
}

export interface TrackItem {
  album: Album;
  artists: Artist[];
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
  items: TrackItem[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

export interface TrackObject {
  tracks: Tracks;
}

export interface AlbumItem {
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

export interface Albums {
  href: string;
  items: AlbumItem[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

export interface AlbumObject {
  albums: Albums;
}

export const searchTracks = async (token: string, searchTerm: string) => {
  const res = await customAxios(token).get<TrackObject>(
    "https://api.spotify.com/v1/search",
    {
      params: {
        q: searchTerm,
        type: "track",
        limit: 50,
      },
    }
  );
  return res;
};

export const searchAlbums = async (token: string, searchTerm: string) => {
  const res = await customAxios(token).get<AlbumObject>(
    "https://api.spotify.com/v1/search",
    {
      params: {
        q: searchTerm,
        type: "album",
        limit: 50,
      },
    }
  );
  return res;
};

export const getTrack = async (token: string, id: string) => {
  const res = await customAxios(token).get<TrackItem>(
    `https://api.spotify.com/v1/tracks/${id}`
  );
  return res;
};
