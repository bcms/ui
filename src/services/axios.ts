import Axios, { AxiosError, AxiosResponse, Method } from 'axios';
import type { JWT } from '../types';
import { LocalStorageService } from './local-storage';
import { Queueable } from './queueable';

export type AxiosServiceConfig = {
  baseUrl?: string;
  headers?: {
    [key: string]: string;
  };
}

export type AxiosServicePrototype = {
  global(config: AxiosServiceConfig): void;
  clear(): void;
  setAccess(at: string): void;
  getAccess(): JWT;
  send(
    config: {
      url: string;
      method: Method;
      headers?: {
        [key: string]: string;
      };
      data?: any;
    },
    skipAuth?: boolean
  ): Promise<void | {
    success: boolean;
    err?: AxiosError;
    res?: AxiosResponse;
  }>;
}

function axiosService(config?: AxiosServiceConfig): AxiosServicePrototype {
  let accessToken: JWT;
  let accessTokenRaw: string;
  const queueable = Queueable<void>('auth');
  const global: AxiosServiceConfig = config
    ? config
    : {
        baseUrl: '',
        headers: {},
      };
  function gotoLogin(error?: string) {
    LocalStorageService.clear();
    accessTokenRaw = undefined;
    accessToken = undefined;
    window.location.href =
      '/' + error
        ? `?error=${encodeURIComponent(btoa(encodeURIComponent(error)))}`
        : '';
  }
  function unpackAccessToken(at: string) {
    accessTokenRaw = at;
    const atParts = at.split('.');
    if (atParts.length === 3) {
      accessToken = {
        header: JSON.parse(atob(atParts[0])),
        payload: JSON.parse(atob(atParts[1])),
        signature: atParts[2],
      };
    }
  }
  async function refreshAccess() {
    await queueable.exec('auth', 'first_done_free_all', async () => {
      if (typeof accessToken !== 'undefined') {
        if (accessToken.payload.iat + accessToken.payload.exp > Date.now()) {
          return;
        }
      } else {
        const at: string = LocalStorageService.get('at');
        if (at) {
          unpackAccessToken(at);
          if (
            (accessToken as JWT).payload.iat +
              (accessToken as JWT).payload.exp >
            Date.now()
          ) {
            return;
          }
        }
      }
      const refreshToken = LocalStorageService.get('rt');
      if (!refreshToken) {
        return gotoLogin();
      }
      try {
        const result = await Axios({
          url: '/auth/token/refresh',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        await LocalStorageService.set('at', result.data.accessToken);
        unpackAccessToken(result.data.accessToken);
      } catch (error) {
        gotoLogin('Failed to refresh access');
        return;
      }
    });
  }
  return {
    setAccess(at) {
      accessTokenRaw = '' + at;
      unpackAccessToken(accessTokenRaw);
    },
    getAccess() {
      if (!accessToken) {
        const at: string = LocalStorageService.get('at');
        if (at) {
          unpackAccessToken(at);
        }
      }
      return accessToken;
    },
    global(conf) {
      if (conf.baseUrl) {
        global.baseUrl = conf.baseUrl;
      }
      if (conf.headers) {
        Object.keys(conf.headers).forEach((key) => {
          global.headers[key] = conf.headers[key];
        });
      }
    },
    clear() {},
    async send(conf, skipAuth) {
      if (conf.data && typeof conf.data === 'object') {
        if (conf.headers) {
          conf.headers['Content-Type'] = 'application/json';
        } else {
          conf.headers = {
            'Content-Type': 'application/json',
          };
        }
      }
      if (conf.headers && conf.headers.Authorization && !skipAuth) {
        await refreshAccess();
        conf.headers.Authorization = `Bearer ${accessTokenRaw}`;
      }
      if (conf.headers) {
        Object.keys(global.headers).forEach((key) => {
          conf.headers[key] = global.headers[key];
        });
      }
      conf.url = global.baseUrl + conf.url;
      try {
        const response = await Axios(conf);
        return {
          success: true,
          res: response,
        };
      } catch (error) {
        if (error.response.status === '401') {
          return gotoLogin(JSON.stringify(error));
        }
        return {
          success: false,
          err: error,
        };
      }
    },
  };
}

export const AxiosService = axiosService({
  baseUrl: 'http://localhost:1280/api',
  headers: {},
});
