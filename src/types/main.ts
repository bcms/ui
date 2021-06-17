import type { BCMSSdkPrototype } from '@becomes/cms-sdk/types';
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
  BCMSTooltipServicePrototype,
} from './services';
import { BCMSPluginNavItem } from './plugin';
import { BCMSGTWLogicFunction } from './helpers';
import { BCMSStore } from './store';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';

export interface BCMSGlobalScopeMain {
  vue: {
    useStore: () => BCMSStore;
    useRoute: () => RouteLocationNormalizedLoaded;
    useRouter: () => Router;
  };
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
    tooltip: BCMSTooltipServicePrototype;
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
