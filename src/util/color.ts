import type { BCMSColorUtility } from '../types';

export function createBcmsColorUtility(): BCMSColorUtility {
  return {
    check(color: string) {
      const checkHex = /^[0-9A-Fa-f]{6}?$/g;
      return color.match(checkHex) ? true : false;
    },
    checkWithAlpha(color: string) {
      const checkHex = /^[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/g;
      return color.match(checkHex) ? true : false;
    },
  };
}
