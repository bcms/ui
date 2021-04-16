import {
  ActionContext,
  ActionTree,
  CommitOptions,
  createLogger,
  createStore,
  DispatchOptions,
  GetterTree,
  MutationTree,
  Store as VuexStore,
} from 'vuex';
import type {
  Template,
  Group,
  Widget,
  Language,
  User,
  ApiKey,
  Media,
  Entry,
  EntryLite,
  Status,
} from '@becomes/cms-sdk';
import * as TemplateStore from '@/store/template';
import * as GroupStore from '@/store/group';
import * as WidgetStore from '@/store/widget';
import * as LanguageStore from '@/store/language';
import * as UserStore from '@/store/user';
import * as ApiKeyStore from '@/store/api-key';
import * as MediaStore from '@/store/media';
import * as EntryStore from '@/store/entry';
import * as EntryLiteStore from '@/store/entry-lite';
import * as StatusStore from '@/store/status';

export interface State {
  template: Template[];
  group: Group[];
  widget: Widget[];
  language: Language[];
  user: User[];
  apiKey: ApiKey[];
  media: Media[];
  entry: Entry[];
  entryLite: EntryLite[];
  status: Status[];
}
export const state: State = {
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

export type Mutations = TemplateStore.Mutations &
  GroupStore.Mutations &
  WidgetStore.Mutations &
  LanguageStore.Mutations &
  UserStore.Mutations &
  ApiKeyStore.Mutations &
  MediaStore.Mutations &
  EntryStore.Mutations &
  EntryLiteStore.Mutations &
  StatusStore.Mutations;
export const mutations: MutationTree<State> & Mutations = {
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

// -----------------
// ---- Getters ----
// -----------------
export type Getters = TemplateStore.Getters &
  GroupStore.Getters &
  WidgetStore.Getters &
  LanguageStore.Getters &
  UserStore.Getters &
  ApiKeyStore.Getters &
  MediaStore.Getters &
  EntryStore.Getters &
  EntryLiteStore.Getters &
  StatusStore.Getters;
export const getters: GetterTree<State, State> & Getters = {
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
export type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
};
export type Actions = TemplateStore.Actions &
  GroupStore.Actions &
  WidgetStore.Actions &
  LanguageStore.Actions &
  UserStore.Actions &
  ApiKeyStore.Actions &
  MediaStore.Actions &
  EntryStore.Actions &
  EntryLiteStore.Actions &
  StatusStore.Actions;
export const actions: ActionTree<State, State> & Actions = {
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
export type Store = Omit<
  VuexStore<State>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};
export const store = createStore<State>({
  state,
  mutations,
  getters,
  plugins: [createLogger()],
});
export function useStore(): Store {
  return store;
}
