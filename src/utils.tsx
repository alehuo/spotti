import React from "react";
import { TextColor } from "./reducers/uiReducer";

/**
 * Get the contrasting color for any hex color
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
export const getContrast = (r: number, g: number, b: number): TextColor => {
  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

export const trimLength = (input: string | undefined, len: number = 48) => {
  if (input === undefined) {
    return "";
  }
  if (input.length > len) {
    return input.substring(0, len - 3) + "...";
  }
  return input;
};

export const MillisToMinutesAndSeconds: React.FC<{ value: number }> = ({
  value,
}) => {
  const minutes = Math.floor(value / 60000);
  const seconds = parseInt(((value % 60000) / 1000).toFixed(0));
  return (
    <span>
      {minutes}
      {":" + (seconds < 10 ? "0" : "") + seconds}
    </span>
  );
};
