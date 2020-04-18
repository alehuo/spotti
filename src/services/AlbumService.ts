import { customAxios } from "../api/customAxios";

export interface AlbumExternalUrls {
  spotify: string;
}

export interface AlbumArtist {
  external_urls: AlbumExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface AlbumCopyright {
  text: string;
  type: string;
}

export interface AlbumExternalIds {
  upc: string;
}

export interface AlbumExternalUrls2 {
  spotify: string;
}

export interface AlbumImage {
  height: number;
  url: string;
  width: number;
}

export interface AlbumExternalUrls3 {
  spotify: string;
}

export interface AlbumArtist2 {
  external_urls: AlbumExternalUrls3;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface AlbumExternalUrls4 {
  spotify: string;
}

export interface AlbumItem {
  artists: AlbumArtist2[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: AlbumExternalUrls4;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface AlbumTracks {
  href: string;
  items: AlbumItem[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface AlbumResponse {
  album_type: string;
  artists: AlbumArtist[];
  available_markets: string[];
  copyrights: AlbumCopyright[];
  external_ids: AlbumExternalIds;
  external_urls: AlbumExternalUrls2;
  genres: any[];
  href: string;
  id: string;
  images: AlbumImage[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  tracks: AlbumTracks;
  type: string;
  uri: string;
}

export const getAlbumInfo = async (token: string, albumId: string) => {
  const res = await customAxios(token).get<AlbumResponse>(
    `https://api.spotify.com/v1/albums/${albumId}`
  );
  return res.data;
};
