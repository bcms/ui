import { navigate } from 'svelte-routing';
import { StoreService } from './store';
import { popup } from './popup';
import type { BCMSPluginNavItem } from '../types';
import { sdk } from './sdk';

export type GeneralServicePrototype = {
  b64: {
    encode(s: string): string;
    decode(s: string): string;
    fromBuffer(buffer: ArrayBuffer): string;
  };
  string: {
    toPretty(s: string): string;
    toUri(s: string): string;
    toUriLowDash(s: string): string;
    toEnum(s: string): string;
    toShort(s: string, length: number): string;
    textBetween(src: string, begin: string, end: string): string;
    allTextBetween(src: string, begin: string, end: string): string[];
  };
  navigate(path: string, options?: any): void;
  errorWrapper(
    throwable: () => Promise<any>,
    ifSuccess: (data: any) => Promise<any>,
    returnError?: boolean
  ): Promise<any>;
  pluginNavItems: BCMSPluginNavItem[];
};

function generalService(): GeneralServicePrototype {
  const self: GeneralServicePrototype = {
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
      textBetween(src, begin, end) {
        const startIndex = src.indexOf(begin);
        if (startIndex === -1) {
          return '';
        }
        const endIndex = src.indexOf(end, startIndex + begin.length);
        if (endIndex === -1) {
          return '';
        }
        return src.substring(startIndex + begin.length, endIndex);
      },
      allTextBetween(src, begin, end) {
        const output: string[] = [];
        const index = {
          begin: src.indexOf(begin, 0),
          end: 0,
        };
        if (index.begin === -1) {
          return [];
        }
        index.end = src.indexOf(end, index.begin);
        if (index.end === -1) {
          return [];
        }
        output.push(src.substring(index.begin + begin.length, index.end));
        while (true) {
          index.begin = src.indexOf(begin, index.end);
          if (index.begin === -1) {
            break;
          }
          index.end = src.indexOf(end, index.begin);
          if (index.end === -1) {
            break;
          }
          output.push(src.substring(index.begin + begin.length, index.end));
        }
        return output;
      },
    },
    navigate(path, options) {
      StoreService.update('path', path);
      navigate(path, options);
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
        if (error.status && error.status === 401) {
          self.navigate(`/`);
        }
        if (error) {
          popup.error(error.message);
        }
        return;
      }
      return await ifSuccess(output);
    },
    pluginNavItems: [],
  };
  return self;
}

export const GeneralService = generalService();
