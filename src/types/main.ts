import type {
  BCMSDateUtility,
  BCMSSdk,
  BCMSStringUtility,
  BCMSThrowable,
} from '@becomes/cms-sdk/types';
import type { Editor } from '@tiptap/core';
import type { Ref } from '@vue/reactivity';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import type { BCMSStore } from './store';
import type {
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
import type { BCMSObjectUtility } from './util';

export interface BCMSGlobalScopeMain<
  CustomModals = unknown,
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
  editorLinkMiddleware: { [id: string]: (event: MouseEvent) => void };
}

export interface BCMSGlobalScopeCloud {
  baseUrl?: string;
  apiOrigin?: string;
  routerBaseUrl?: string;
  iid?: string;
}
