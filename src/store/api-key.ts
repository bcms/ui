import { ActionAugments, State } from './main';
import { ActionTypes, GetterTypes, MutationTypes } from './enums';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import type { BCMSApiKey } from '@becomes/cms-sdk/types';

type EntryItem = BCMSApiKey;

export interface Mutations {
  [MutationTypes.apiKey_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.apiKey_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.apiKey_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.apiKey_set](state, payload) {
    defaultEntryMutations.set(state.apiKey, payload);
  },
  [MutationTypes.apiKey_update](state, payload) {
    defaultEntryMutations.update(state.apiKey, payload);
  },
  [MutationTypes.apiKey_remove](state, payload) {
    defaultEntryMutations.remove(state.apiKey, payload);
  },
};

export interface Getters {
  [GetterTypes.apiKey_items](state: State): EntryItem[];
  [GetterTypes.apiKey_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.apiKey_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.apiKey_items](state) {
    return state.apiKey;
  },
  [GetterTypes.apiKey_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.apiKey, query);
    };
  },
  [GetterTypes.apiKey_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.apiKey, query);
    };
  },
};

export interface Actions {
  [ActionTypes.apiKey_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.apiKey_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.apiKey_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.apiKey_set]({ commit }, payload) {
    commit(MutationTypes.apiKey_set, payload);
  },
  [ActionTypes.apiKey_update]({ commit }, payload) {
    commit(MutationTypes.apiKey_update, payload);
  },
  [ActionTypes.apiKey_remove]({ commit }, payload) {
    commit(MutationTypes.apiKey_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
