import {
  ActionAugments,
  ActionTypes,
  GetterTypes,
  MutationTypes,
  State,
} from '@/store/index';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from '@/store/_defaults';
import type { Template } from '@becomes/cms-sdk';

type EntryItem = Template;

export interface Mutations {
  [MutationTypes.template_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.template_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.template_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.template_set](state, payload) {
    defaultEntryMutations.set(state.template, payload);
  },
  [MutationTypes.template_update](state, payload) {
    defaultEntryMutations.update(state.template, payload);
  },
  [MutationTypes.template_remove](state, payload) {
    defaultEntryMutations.remove(state.template, payload);
  },
};

export interface Getters {
  [GetterTypes.template_items](state: State): EntryItem[];
  [GetterTypes.template_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.template_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.template_items](state) {
    return state.template;
  },
  [GetterTypes.template_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.template, query);
    };
  },
  [GetterTypes.template_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.template, query);
    };
  },
};

export interface Actions {
  [ActionTypes.template_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.template_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.template_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.template_set]({ commit }, payload) {
    commit(MutationTypes.template_set, payload);
  },
  [ActionTypes.template_update]({ commit }, payload) {
    commit(MutationTypes.template_update, payload);
  },
  [ActionTypes.template_remove]({ commit }, payload) {
    commit(MutationTypes.template_remove, payload);
  },
};

export const TemplateStore = {
  mutations,
  getters,
  actions,
};
