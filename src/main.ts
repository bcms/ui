import { createApp } from 'vue';
import App from './app.vue';
import router from './router';
import { store } from './store';
import { cy } from './directives';
import {
  BCMSErrorService,
  BCMSGeneralService,
  BCMSHeadMetaService,
  BCMSMarkdownService,
  BCMSNotificationService,
} from './services';
import { BCMSSdk } from '@becomes/cms-sdk';

if (!window.bcms) {
  window.bcms = {
    sdk: undefined as never,
    services: undefined as never,
    plugins: undefined as never,
  };
}
window.bcms.services = {
  general: BCMSGeneralService(),
  headMeta: BCMSHeadMetaService(),
  notification: BCMSNotificationService(),
  error: BCMSErrorService(),
  markdown: BCMSMarkdownService(),
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
