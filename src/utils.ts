/*!
 * Get the contrasting color for any hex color
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */

import { TextColor } from "./reducers/uiReducer";

export const getContrast = (r: number, g: number, b: number): TextColor => {
  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};
