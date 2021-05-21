import { createApp } from 'vue';
import App from './app.vue';
import router from './router';
import { store, useStore } from './store';
import { cy } from './directives';
import {
  BCMSErrorService,
  BCMSGeneralService,
  BCMSHeadMetaService,
  BCMSMarkdownService,
  BCMSNotificationService,
  BCMSModalService,
  BCMSConfirmService,
  BCMSEntryService,
  BCMSPropsCheckerService,
} from './services';
import { BCMSSdk } from '@becomes/cms-sdk';
import { BCMSGTWLogic } from './helpers';
import { BCMSMediaService } from './services/media';
import { useRoute, useRouter } from 'vue-router';

if (!window.bcms) {
  window.bcms = {
    vue: {
      useStore,
      useRoute,
      useRouter,
    },
    sdk: undefined as never,
    services: undefined as never,
    helpers: undefined as never,
    plugins: undefined as never,
  };
}
window.bcms.services = {
  confirm: BCMSConfirmService(),
  entry: BCMSEntryService(),
  general: BCMSGeneralService(),
  headMeta: BCMSHeadMetaService(),
  notification: BCMSNotificationService(),
  error: BCMSErrorService(),
  modal: BCMSModalService(),
  media: BCMSMediaService(),
  markdown: BCMSMarkdownService(),
  propsChecker: BCMSPropsCheckerService(),
};
window.bcms.helpers = {
  gtw: BCMSGTWLogic,
};
window.bcms.sdk = BCMSSdk();
if (!window.bcms.plugins) {
  window.bcms.plugins = [
    {
      label: 'Ember',
      link: 'ember',
      name: 'ember',
    },
  ];
}

const app = createApp(App);
app.directive('cy', cy);
app.use(store).use(router).mount('#app');
