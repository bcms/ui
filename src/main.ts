import { createApp } from 'vue';
import { createBcmsSdk } from '@becomes/cms-sdk';
import { bcmsStore } from '@becomes/cms-sdk/store';

import App from './app.vue';
import router from './router';
import { cy, clickOutside, tooltip } from './directives';
import {
  createBcmsHeadMetaService,
  createBcmsMarkdownService,
  createBcmsModalService,
  createBcmsNotificationService,
  createBcmsTooltipService,
  useBcmsHeadMetaService,
  useBcmsMarkdownService,
  useBcmsModalService,
  useBcmsNotificationService,
  useBcmsTooltipService,
  createBcmsConfirmService,
  useBcmsConfirmService,
  createBcmsEntryService,
  useBcmsEntryService,
  createBcmsMediaService,
  useBcmsMediaService,
} from './services';
import { createBcmsPropService, useBcmsPropService } from './services/prop';
import { createBcmsObjectUtility, useBcmsObjectUtility } from './util';

createBcmsObjectUtility();
createBcmsConfirmService();
createBcmsHeadMetaService();
createBcmsMarkdownService();
createBcmsNotificationService();
createBcmsTooltipService();
createBcmsModalService();
createBcmsPropService();
createBcmsEntryService();
createBcmsMediaService();

if (!window.bcms) {
  window.bcms = {
    vue: {
      router,
    },
    confirm: useBcmsConfirmService(),
    meta: useBcmsHeadMetaService(),
    markdown: useBcmsMarkdownService(),
    notification: useBcmsNotificationService(),
    tooltip: useBcmsTooltipService(),
    modal: useBcmsModalService(),
    prop: useBcmsPropService(),
    entry: useBcmsEntryService(),
    media: useBcmsMediaService(),
    util: {
      throwable: undefined as never,
      string: undefined as never,
      date: undefined as never,
      object: useBcmsObjectUtility(),
    },
    sdk: undefined as never,
  };
}
window.bcms.sdk = createBcmsSdk({});
window.bcms.util.throwable = window.bcms.sdk.util.throwable;
window.bcms.util.date = window.bcms.sdk.util.date;
window.bcms.util.string = window.bcms.sdk.util.string;

const app = createApp(App);
app.directive('cy', cy);
app.directive('clickOutside', clickOutside);
app.directive('tooltip', tooltip);
app.use(bcmsStore).use(router).mount('#bcms-container');
