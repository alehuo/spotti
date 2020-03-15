import { customAxios } from "../api/customAxios";

export const search = async (token: string, searchTerm: string) => {
  const res = await customAxios(token).get(
    "https://api.spotify.com/v1/search",
    {
      params: {
        q: searchTerm,
        type: "track"
      }
    }
  );
  return res.data;
};
