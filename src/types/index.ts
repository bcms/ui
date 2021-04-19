import type { BCMSSdkPrototype } from '@becomes/cms-sdk/types';
import type {
  BCMSErrorServicePrototype,
  BCMSGeneralServicePrototype,
  BCMSHeadMetaServicePrototype,
  BCMSMarkdownServicePrototype,
  BCMSNotificationServicePrototype,
  BCMSPluginNavItem,
} from '@/types';

export * from './components';
export * from './entry';
export * from './jwt';
export * from './services';
export * from './util';

export * from './nav-item';
export * from './plugin';

export interface GlobalScope {
  bcms: {
    services: {
      headMeta: BCMSHeadMetaServicePrototype;
      general: BCMSGeneralServicePrototype;
      error: BCMSErrorServicePrototype;
      notification: BCMSNotificationServicePrototype;
      markdown: BCMSMarkdownServicePrototype;
    };
    sdk: BCMSSdkPrototype;
    plugins?: BCMSPluginNavItem[];
  };
  cloud?: {
    baseUrl?: string;
    apiOrigin?: string;
    routerBaseUrl?: string;
    iid?: string;
  };
}
declare global {
  interface Global extends GlobalScope {
    __nt?: unknown;
  }
  interface Window extends GlobalScope {
    __nt?: unknown;
  }
}
