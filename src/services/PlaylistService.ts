import { customAxios } from "../api/customAxios";

export interface Img {
  height: number | null;
  width: number | null;
  url: string;
}
export interface Playlist {
  collaborative: boolean;
  description: string;
  id: string;
  images: Img[];
  name: string;
  primary_color: null | string;
  public: boolean;
  tracks: {
    href: string;
    total: number;
  };
}

export const fetchPlaylists = async (token: string) => {
  const res = await customAxios(token).get<{ items: Playlist[] }>(
    "https://api.spotify.com/v1/me/playlists"
  );
  const playlists = [...res.data.items];
  return playlists;
};
