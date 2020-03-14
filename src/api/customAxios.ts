import axios from "axios";

export const customAxios = (token: string) =>
  axios.create({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
