import type {
  BCMSDateUtility,
  BCMSSdk,
  BCMSStringUtility,
  BCMSThrowable,
} from '@becomes/cms-sdk/types';
import { Router } from 'vue-router';
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
    router: Router;
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
    throwable: BCMSThrowable;
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
    // Is declared in components/content/node-nav.vue
    editorNodeEnter(data: { element: HTMLElement }): void;
    editorNodeLeave(data: { element: HTMLElement }): void;

    bcms: BCMSGlobalScopeMain;
    bcmsCloud: BCMSGlobalScopeCloud;
  }
}
