import { createI18n } from 'vue-i18n';

import routerData from './router';
import navData from './layout/nav';
import footerData from './layout/footer';
import modalData from './layout/modal';
import errorPage from './pages/error';
import homePage from './pages/home';
import keyManagerPage from './pages/key-manager';
import settingsPage from './pages/settings';
import mediaPage from './pages/media';
import templatePage from './pages/template';
import groupPage from './pages/group';
import widgetPage from './pages/widget';
import pluginPage from './pages/plugin';
import entriesPage from './pages/entries';
import entryPage from './pages/entry';

const messages = {
  en: {
    router: routerData.en,
    nav: navData.en,
    footer: footerData.en,
    modal: modalData.en,
    error: errorPage.en,
    home: homePage.en,
    keyManager: keyManagerPage.en,
    settings: settingsPage.en,
    media: mediaPage.en,
    template: templatePage.en,
    group: groupPage.en,
    widget: widgetPage.en,
    entries: entriesPage.en,
    entry: entryPage.en,
    plugin: pluginPage.en,
  },
};

// TODO: Typescript
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
