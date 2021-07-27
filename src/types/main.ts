import type {
  BCMSDateUtility,
  BCMSSdk,
  BCMSStringUtility,
} from '@becomes/cms-sdk/types';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import {
  BCMSConfirmService,
  BCMSEntryService,
  BCMSHeadMetaService,
  BCMSMarkdownService,
  BCMSMediaService,
  BCMSModalService,
  BCMSNotificationService,
  BCMSPropService,
  BCMSTooltipService,
} from './services';
import { BCMSObjectUtility } from './util';

export interface BCMSGlobalScopeMain {
  vue: {
    useRoute: () => RouteLocationNormalizedLoaded;
    useRouter: () => Router;
  };
  confirm: BCMSConfirmService;
  meta: BCMSHeadMetaService;
  markdown: BCMSMarkdownService;
  notification: BCMSNotificationService;
  tooltip: BCMSTooltipService;
  modal: BCMSModalService;
  prop: BCMSPropService;
  entry: BCMSEntryService;
  media: BCMSMediaService;
  util: {
    string: BCMSStringUtility;
    date: BCMSDateUtility;
    object: BCMSObjectUtility;
  };
  sdk: BCMSSdk;
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
    bcmsCloud: BCMSGlobalScopeCloud;
  }
}
