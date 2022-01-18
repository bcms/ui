import type {
  BCMSDateUtility,
  BCMSSdk,
  BCMSStringUtility,
  BCMSThrowable,
} from '@becomes/cms-sdk/types';
import { Editor } from '@tiptap/core';
import { Ref } from '@vue/reactivity';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { BCMSStore } from './store';
import {
  BCMSConfirmService,
  BCMSEntryService,
  BCMSHeadMetaService,
  BCMSMarkdownService,
  BCMSMediaService,
  BCMSModalServiceExtended,
  BCMSNotificationService,
  BCMSPropService,
  BCMSTooltipService,
} from './services';
import { BCMSObjectUtility } from './util';

export interface BCMSGlobalScopeMain<
  CustomModals = undefined,
  CustomSocketEventsData = unknown
> {
  vue: {
    router: Router;
    route: () => RouteLocationNormalizedLoaded;
    store: BCMSStore;
  };
  confirm: BCMSConfirmService;
  meta: BCMSHeadMetaService;
  markdown: BCMSMarkdownService;
  notification: BCMSNotificationService;
  tooltip: BCMSTooltipService;
  modal: BCMSModalServiceExtended<CustomModals>;
  prop: BCMSPropService;
  entry: BCMSEntryService;
  media: BCMSMediaService;
  util: {
    throwable: BCMSThrowable;
    string: BCMSStringUtility;
    date: BCMSDateUtility;
    object: BCMSObjectUtility;
  };
  sdk: BCMSSdk<CustomSocketEventsData>;
  editor?: Ref<Editor | undefined>;
}

export interface BCMSGlobalScopeCloud {
  baseUrl?: string;
  apiOrigin?: string;
  routerBaseUrl?: string;
  iid?: string;
}
