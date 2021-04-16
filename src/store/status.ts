import {
  ActionAugments,
  ActionTypes,
  GetterTypes,
  MutationTypes,
  State,
} from '@/store/index';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from '@/store/_defaults';
import type { Status } from '@becomes/cms-sdk';

type EntryItem = Status;

export interface Mutations {
  [MutationTypes.status_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.status_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.status_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.status_set](state, payload) {
    defaultEntryMutations.set(state.status, payload);
  },
  [MutationTypes.status_update](state, payload) {
    defaultEntryMutations.update(state.status, payload);
  },
  [MutationTypes.status_remove](state, payload) {
    defaultEntryMutations.remove(state.status, payload);
  },
};

export interface Getters {
  [GetterTypes.status_items](state: State): EntryItem[];
  [GetterTypes.status_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.status_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.status_items](state) {
    return state.status;
  },
  [GetterTypes.status_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.status, query);
    };
  },
  [GetterTypes.status_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.status, query);
    };
  },
};

export interface Actions {
  [ActionTypes.status_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.status_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.status_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.status_set]({ commit }, payload) {
    commit(MutationTypes.status_set, payload);
  },
  [ActionTypes.status_update]({ commit }, payload) {
    commit(MutationTypes.status_update, payload);
  },
  [ActionTypes.status_remove]({ commit }, payload) {
    commit(MutationTypes.status_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
