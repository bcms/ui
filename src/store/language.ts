import {
  ActionAugments,
  ActionTypes,
  GetterTypes,
  MutationTypes,
  State,
} from '@/store/index';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from '@/store/_defaults';
import type { BCMSLanguage } from '@becomes/cms-sdk/types';

type EntryItem = BCMSLanguage;

export interface Mutations {
  [MutationTypes.language_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.language_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.language_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.language_set](state, payload) {
    defaultEntryMutations.set(state.language, payload);
  },
  [MutationTypes.language_update](state, payload) {
    defaultEntryMutations.update(state.language, payload);
  },
  [MutationTypes.language_remove](state, payload) {
    defaultEntryMutations.remove(state.language, payload);
  },
};

export interface Getters {
  [GetterTypes.language_items](state: State): EntryItem[];
  [GetterTypes.language_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.language_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.language_items](state) {
    return state.language;
  },
  [GetterTypes.language_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.language, query);
    };
  },
  [GetterTypes.language_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.language, query);
    };
  },
};

export interface Actions {
  [ActionTypes.language_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.language_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.language_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.language_set]({ commit }, payload) {
    commit(MutationTypes.language_set, payload);
  },
  [ActionTypes.language_update]({ commit }, payload) {
    commit(MutationTypes.language_update, payload);
  },
  [ActionTypes.language_remove]({ commit }, payload) {
    commit(MutationTypes.language_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
