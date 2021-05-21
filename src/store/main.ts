import {
  ActionTree,
  createLogger,
  createStore,
  GetterTree,
  MutationTree,
} from 'vuex';
import * as TemplateStore from './template';
import * as GroupStore from './group';
import * as WidgetStore from './widget';
import * as LanguageStore from './language';
import * as UserStore from './user';
import * as ApiKeyStore from './api-key';
import * as MediaStore from './media';
import * as EntryStore from './entry';
import * as EntryLiteStore from './entry-lite';
import * as StatusStore from './status';
import {
  BCMSStore,
  BCMSStoreActions,
  BCMSStoreGetters,
  BCMSStoreMutations,
  BCMSStoreState,
} from '../types';

export const state: BCMSStoreState = {
  template: [],
  group: [],
  widget: [],
  language: [],
  user: [],
  apiKey: [],
  media: [],
  entry: [],
  entryLite: [],
  status: [],
};

export const mutations: MutationTree<BCMSStoreState> & BCMSStoreMutations = {
  ...TemplateStore.store.mutations,
  ...GroupStore.store.mutations,
  ...WidgetStore.store.mutations,
  ...LanguageStore.store.mutations,
  ...UserStore.store.mutations,
  ...ApiKeyStore.store.mutations,
  ...MediaStore.store.mutations,
  ...EntryStore.store.mutations,
  ...EntryLiteStore.store.mutations,
  ...StatusStore.store.mutations,
};
export const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreGetters = {
  ...TemplateStore.store.getters,
  ...GroupStore.store.getters,
  ...WidgetStore.store.getters,
  ...LanguageStore.store.getters,
  ...UserStore.store.getters,
  ...ApiKeyStore.store.getters,
  ...MediaStore.store.getters,
  ...EntryStore.store.getters,
  ...EntryLiteStore.store.getters,
  ...StatusStore.store.getters,
};

// -----------------
// ---- Actions ----
// -----------------
export const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreActions = {
  ...TemplateStore.store.actions,
  ...GroupStore.store.actions,
  ...WidgetStore.store.actions,
  ...LanguageStore.store.actions,
  ...UserStore.store.actions,
  ...ApiKeyStore.store.actions,
  ...MediaStore.store.actions,
  ...EntryStore.store.actions,
  ...EntryLiteStore.store.actions,
  ...StatusStore.store.actions,
};

// ---------------
// ---- Store ----
// ---------------
export const store = createStore<BCMSStoreState>({
  state,
  mutations,
  getters,
  plugins: [createLogger()],
});
export function useStore(): BCMSStore {
  return store;
}
