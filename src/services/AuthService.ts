import queryString from "query-string";

const authEndpoint = "https://accounts.spotify.com/authorize";
const query = queryString.stringify(
  {
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
    scope: process.env.REACT_APP_SPOTIFY_SCOPES,
    response_type: "token"
  },
  { arrayFormat: "bracket" }
);
export const authUrl = `${authEndpoint}?${query}`;
