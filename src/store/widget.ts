import { ActionAugments, State } from './main';
import { ActionTypes, GetterTypes, MutationTypes } from './enums';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import type { BCMSWidget } from '@becomes/cms-sdk/types';

type EntryItem = BCMSWidget;

export interface Mutations {
  [MutationTypes.widget_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.widget_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.widget_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.widget_set](state, payload) {
    defaultEntryMutations.set(state.widget, payload);
  },
  [MutationTypes.widget_update](state, payload) {
    defaultEntryMutations.update(state.widget, payload);
  },
  [MutationTypes.widget_remove](state, payload) {
    defaultEntryMutations.remove(state.widget, payload);
  },
};

export interface Getters {
  [GetterTypes.widget_items](state: State): EntryItem[];
  [GetterTypes.widget_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.widget_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.widget_items](state) {
    return state.widget;
  },
  [GetterTypes.widget_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.widget, query);
    };
  },
  [GetterTypes.widget_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.widget, query);
    };
  },
};

export interface Actions {
  [ActionTypes.widget_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.widget_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.widget_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.widget_set]({ commit }, payload) {
    commit(MutationTypes.widget_set, payload);
  },
  [ActionTypes.widget_update]({ commit }, payload) {
    commit(MutationTypes.widget_update, payload);
  },
  [ActionTypes.widget_remove]({ commit }, payload) {
    commit(MutationTypes.widget_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
