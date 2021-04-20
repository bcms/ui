import type { BCMSSdkPrototype } from '@becomes/cms-sdk/types';
import {
  BCMSConfirmServicePrototype,
  BCMSErrorServicePrototype,
  BCMSGeneralServicePrototype,
  BCMSHeadMetaServicePrototype,
  BCMSMarkdownServicePrototype,
  BCMSModalServicePrototype,
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
    confirm: BCMSConfirmServicePrototype;
    headMeta: BCMSHeadMetaServicePrototype;
    general: BCMSGeneralServicePrototype;
    error: BCMSErrorServicePrototype;
    notification: BCMSNotificationServicePrototype;
    modal: BCMSModalServicePrototype;
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
