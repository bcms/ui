import { navigate } from 'svelte-routing';
import { StoreService } from './store';

export interface GeneralServicePrototype {
  b64: {
    encode(s: string): string;
    decode(s: string): string;
  };
  string: {
    toPretty(s: string): string;
    toUri(s: string): string;
    toUriLowDash(s: string): string;
    toEnum(s: string): string;
  };
  navigate(path: string);
}

function generalService(): GeneralServicePrototype {
  return {
    b64: {
      encode(s) {
        return btoa(s).replace(/=/g, '');
      },
      decode(s) {
        return atob(s);
      },
    },
    string: {
      toPretty(s) {
        if (s.indexOf('_') !== -1) {
          return s
            .split('_')
            .map((e) => {
              return (
                e.substring(0, 1).toUpperCase() +
                e.substring(1, e.length).toLowerCase()
              );
            })
            .join(' ');
        } else {
          return s
            .split('-')
            .map((e) => {
              return (
                e.substring(0, 1).toUpperCase() +
                e.substring(1, e.length).toLowerCase()
              );
            })
            .join(' ');
        }
      },
      toUri(s) {
        return s
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/_/g, '-')
          .replace(/[^0-9a-z---]+/g, '');
      },
      toUriLowDash(s) {
        return s
          .toLowerCase()
          .replace(/ /g, '_')
          .replace(/-/g, '_')
          .replace(/[^0-9a-z_-_]+/g, '');
      },
      toEnum(s) {
        return s
          .toUpperCase()
          .replace(/ /g, '_')
          .replace(/-/g, '_')
          .replace(/[^0-9A-Z_-_]+/g, '');
      },
    },
    navigate(path) {
      StoreService.update('path', path);
      navigate(path);
    },
  };
}

export const GeneralService = generalService();
