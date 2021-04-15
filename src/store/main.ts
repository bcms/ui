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
import {
  Actions as TemplateActions,
  Getters as TemplateGetters,
  Mutations as TemplateMutations,
  TemplateStore,
} from '@/store/template';
import type { Template } from '@becomes/cms-sdk';

export interface State {
  template: Template[];
}
export const state: State = {
  template: [],
};

export type Mutations = TemplateMutations;
export const mutations: MutationTree<State> & Mutations = {
  ...TemplateStore.mutations,
};

// -----------------
// ---- Getters ----
// -----------------
export type Getters = TemplateGetters;
export const getters: GetterTree<State, State> & Getters = {
  ...TemplateStore.getters,
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
export type Actions = TemplateActions;
export const actions: ActionTree<State, State> & Actions = {
  ...TemplateStore.actions,
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
