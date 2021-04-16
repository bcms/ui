import { BCMSPluginNavItem } from '@/types/plugin';
import { BCMSPrototype } from '@becomes/cms-sdk';
import {
  BCMSErrorServicePrototype,
  BCMSGeneralServicePrototype,
  BCMSHeadMetaServicePrototype,
  BCMSNotificationServicePrototype,
} from '@/types';

export * from './jwt';
export * from './entry';
export * from './plugin';
export * from './nav-item';
export * from './components';
export * from './util';
export * from './services';

export interface GlobalScope {
  bcms: {
    services: {
      headMeta: BCMSHeadMetaServicePrototype;
      general: BCMSGeneralServicePrototype;
      error: BCMSErrorServicePrototype;
      notification: BCMSNotificationServicePrototype;
    };
    sdk: BCMSPrototype;
    plugins?: BCMSPluginNavItem[];
  };
  cloud?: {
    baseUrl?: string;
    apiOrigin?: string;
    routerBaseUrl?: string;
    iid?: string;
  };
}
declare type global = GlobalScope;
declare global {
  interface Global extends GlobalScope {
    __nt?: unknown;
  }
  interface Window extends GlobalScope {
    __nt?: unknown;
  }
}
