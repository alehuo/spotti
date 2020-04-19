// "Now playing"
export const imageWidth = "136px";
export const imageHeight = imageWidth;
export const nowPlayingHeight = "calc(136px + 32px)";
export const nowPlayingWidth = "100%";
export const msWidth = "48px";
// App
export const appHeight = "100vh";
export const appWidth = "100vw";
// Playlist
export const playlistItemHeight = "100px";
// Colors
export const textColor = "#000000FF";

export const sizes = {
  mobile: 375,
  tablet: 768,
  laptop: 1024,
  desktop: 1560,
  uhd: 2048,
};

export const device = {
  mobile: `(max-width: ${sizes.tablet - 1}px)`,
  tablet: `(min-width: ${sizes.tablet}px) and (max-width: ${sizes.desktop}px)`,
  desktop: `(min-width: ${sizes.desktop + 1}px) and (max-width: ${
    sizes.uhd
  }px)`,
  uhd: `(min-width: ${sizes.uhd + 1}px)`,
};
