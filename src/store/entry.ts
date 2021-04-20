import { ActionAugments, State } from './main';
import { ActionTypes, GetterTypes, MutationTypes } from './enums';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import type { BCMSEntry } from '@becomes/cms-sdk/types';

type EntryItem = BCMSEntry;

export interface Mutations {
  [MutationTypes.entry_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.entry_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.entry_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.entry_set](state, payload) {
    defaultEntryMutations.set(state.entry, payload);
  },
  [MutationTypes.entry_update](state, payload) {
    defaultEntryMutations.update(state.entry, payload);
  },
  [MutationTypes.entry_remove](state, payload) {
    defaultEntryMutations.remove(state.entry, payload);
  },
};

export interface Getters {
  [GetterTypes.entry_items](state: State): EntryItem[];
  [GetterTypes.entry_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.entry_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.entry_items](state) {
    return state.entry;
  },
  [GetterTypes.entry_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.entry, query);
    };
  },
  [GetterTypes.entry_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.entry, query);
    };
  },
};

export interface Actions {
  [ActionTypes.entry_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.entry_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.entry_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.entry_set]({ commit }, payload) {
    commit(MutationTypes.entry_set, payload);
  },
  [ActionTypes.entry_update]({ commit }, payload) {
    commit(MutationTypes.entry_update, payload);
  },
  [ActionTypes.entry_remove]({ commit }, payload) {
    commit(MutationTypes.entry_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
