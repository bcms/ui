import {
  ActionAugments,
  ActionTypes,
  GetterTypes,
  MutationTypes,
  State,
} from '@/store/index';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from '@/store/_defaults';
import type { BCMSEntryLite } from '@becomes/cms-sdk/types';

type EntryItem = BCMSEntryLite;

export interface Mutations {
  [MutationTypes.entryLite_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.entryLite_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.entryLite_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.entryLite_set](state, payload) {
    defaultEntryMutations.set(state.entryLite, payload);
  },
  [MutationTypes.entryLite_update](state, payload) {
    defaultEntryMutations.update(state.entryLite, payload);
  },
  [MutationTypes.entryLite_remove](state, payload) {
    defaultEntryMutations.remove(state.entryLite, payload);
  },
};

export interface Getters {
  [GetterTypes.entryLite_items](state: State): EntryItem[];
  [GetterTypes.entryLite_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.entryLite_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.entryLite_items](state) {
    return state.entryLite;
  },
  [GetterTypes.entryLite_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.entryLite, query);
    };
  },
  [GetterTypes.entryLite_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.entryLite, query);
    };
  },
};

export interface Actions {
  [ActionTypes.entryLite_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.entryLite_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.entryLite_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.entryLite_set]({ commit }, payload) {
    commit(MutationTypes.entryLite_set, payload);
  },
  [ActionTypes.entryLite_update]({ commit }, payload) {
    commit(MutationTypes.entryLite_update, payload);
  },
  [ActionTypes.entryLite_remove]({ commit }, payload) {
    commit(MutationTypes.entryLite_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
