import { createApp } from 'vue';
import {
  createBcmsDateUtility,
  createBcmsSdk,
  createBcmsStringUtility,
  useBcmsStringUtility,
  useDateUtility,
} from '@becomes/cms-sdk';
import { bcmsStore } from '@becomes/cms-sdk/store';
import { useRoute, useRouter } from 'vue-router';

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

createBcmsStringUtility();
createBcmsDateUtility();
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
      useRoute,
      useRouter,
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
      string: useBcmsStringUtility(),
      date: useDateUtility(),
      object: useBcmsObjectUtility(),
    },
    sdk: undefined as never,
  };
}
window.bcms.sdk = createBcmsSdk({});

const app = createApp(App);
app.directive('cy', cy);
app.directive('clickOutside', clickOutside);
app.directive('tooltip', tooltip);
app.use(bcmsStore).use(router).mount('#bcms-container');
