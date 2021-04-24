import type {
  BCMSSdkPrototype,
  BCMSGroup,
  BCMSTemplate,
  BCMSWidget,
} from '@becomes/cms-sdk/types';
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
import { BCMSGTWLogicFunction, BCMSGTWLogicPrototype } from './helpers';

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
  helpers: {
    gtw: BCMSGTWLogicFunction;
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
