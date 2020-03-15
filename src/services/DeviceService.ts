import { customAxios } from "../api/customAxios";

export const setActiveDevice = async (token: string, deviceId: string) => {
  await customAxios(token).put("https://api.spotify.com/v1/me/player", {
    device_ids: [deviceId]
  });
};
