import type {
  BCMSSdkPrototype,
  BCMSGroup,
  BCMSTemplate,
  BCMSWidget,
} from '@becomes/cms-sdk/types';
import {
  BCMSConfirmServicePrototype,
  BCMSEntryServicePrototype,
  BCMSErrorServicePrototype,
  BCMSGeneralServicePrototype,
  BCMSHeadMetaServicePrototype,
  BCMSMarkdownServicePrototype,
  BCMSMediaServicePrototype,
  BCMSModalServicePrototype,
  BCMSNotificationServicePrototype,
  BCMSPropsCheckerServicePrototype,
} from './services';
import { BCMSPluginNavItem } from './plugin';
import { BCMSGTWLogicFunction } from './helpers';

export interface BCMSGlobalScopeMain {
  services: {
    confirm: BCMSConfirmServicePrototype;
    entry: BCMSEntryServicePrototype;
    headMeta: BCMSHeadMetaServicePrototype;
    general: BCMSGeneralServicePrototype;
    error: BCMSErrorServicePrototype;
    notification: BCMSNotificationServicePrototype;
    modal: BCMSModalServicePrototype;
    media: BCMSMediaServicePrototype;
    markdown: BCMSMarkdownServicePrototype;
    propsChecker: BCMSPropsCheckerServicePrototype;
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
