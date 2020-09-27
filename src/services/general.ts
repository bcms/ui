import { navigate } from 'svelte-routing';
import { StoreService } from './store';
// @ts-ignore
import { popup } from '../components/popup.svelte';

export interface GeneralServicePrototype {
  b64: {
    encode(s: string): string;
    decode(s: string): string;
    fromBuffer(buffer: Buffer | ArrayBuffer): string;
  };
  string: {
    toPretty(s: string): string;
    toUri(s: string): string;
    toUriLowDash(s: string): string;
    toEnum(s: string): string;
    toShort(s: string, length: number): string;
  };
  navigate(path: string): void;
  errorWrapper(
    throwable: () => Promise<any>,
    ifSuccess: (data: any) => Promise<any>,
    returnError?: boolean
  ): Promise<any>;
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
      fromBuffer(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
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
      toShort(s, length) {
        if (s.length > length) {
          const d = s.length - length;
          const firstPart = s.substring(0, s.length / 2 - d / 2);
          const lastPart = s.substring(s.length / 2 + d / 2);
          return firstPart + ' ... ' + lastPart;
        }
        return s;
      },
    },
    navigate(path) {
      StoreService.update('path', path);
      navigate(path);
    },
    async errorWrapper(throwable, ifSuccess, returnError) {
      let output: any;
      try {
        output = await throwable();
      } catch (error) {
        if (returnError) {
          return error;
        }
        console.error(error);
        popup.error(error.message);
        return;
      }
      return await ifSuccess(output);
    },
  };
}

export const GeneralService = generalService();
