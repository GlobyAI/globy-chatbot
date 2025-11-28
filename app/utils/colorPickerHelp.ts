/**
 * convert alpha (0--1) to percent (0-100)
 * @param alpha 
 * 
 */
export const convertAlphaToPercent = (alpha: number) => {
  return Math.round(+alpha.toFixed(2) * 100);
};