import {
  ActionAugments,
  ActionTypes,
  GetterTypes,
  MutationTypes,
  State,
} from '@/store/index';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from '@/store/_defaults';
import type { Group } from '@becomes/cms-sdk';

type EntryItem = Group;

export interface Mutations {
  [MutationTypes.group_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.group_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.group_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.group_set](state, payload) {
    defaultEntryMutations.set(state.group, payload);
  },
  [MutationTypes.group_update](state, payload) {
    defaultEntryMutations.update(state.group, payload);
  },
  [MutationTypes.group_remove](state, payload) {
    defaultEntryMutations.remove(state.group, payload);
  },
};

export interface Getters {
  [GetterTypes.group_items](state: State): EntryItem[];
  [GetterTypes.group_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.group_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.group_items](state) {
    return state.group;
  },
  [GetterTypes.group_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.group, query);
    };
  },
  [GetterTypes.group_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.group, query);
    };
  },
};

export interface Actions {
  [ActionTypes.group_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.group_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.group_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.group_set]({ commit }, payload) {
    commit(MutationTypes.group_set, payload);
  },
  [ActionTypes.group_update]({ commit }, payload) {
    commit(MutationTypes.group_update, payload);
  },
  [ActionTypes.group_remove]({ commit }, payload) {
    commit(MutationTypes.group_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
