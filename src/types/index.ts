import type { BCMSSdkPrototype } from '@becomes/cms-sdk/types';
import {
  BCMSErrorServicePrototype,
  BCMSGeneralServicePrototype,
  BCMSHeadMetaServicePrototype,
  BCMSMarkdownServicePrototype,
  BCMSNotificationServicePrototype,
} from './services';
import { BCMSPluginNavItem } from './plugin';

export * from './components';
export * from './models';
export * from './services';
export * from './util';

export * from './plugin';

export interface BCMSGlobalScopeMain {
  services: {
    headMeta: BCMSHeadMetaServicePrototype;
    general: BCMSGeneralServicePrototype;
    error: BCMSErrorServicePrototype;
    notification: BCMSNotificationServicePrototype;
    markdown: BCMSMarkdownServicePrototype;
  };
  sdk: BCMSSdkPrototype;
  plugins?: BCMSPluginNavItem[];
}

export interface BCMSGlobalScopeCloud {
  baseUrl?: string;
  apiOrigin?: string;
  routerBaseUrl?: string;
  iid?: string;
}

declare global {
  interface Window {
    bcms: BCMSGlobalScopeMain;
    cloud: BCMSGlobalScopeCloud;
  }
}
