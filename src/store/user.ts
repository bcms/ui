import {
  ActionAugments,
  ActionTypes,
  GetterTypes,
  MutationTypes,
  State,
} from '@/store/index';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from '@/store/_defaults';
import type { BCMSUser } from '@becomes/cms-sdk/types';

type EntryItem = BCMSUser;

export interface Mutations {
  [MutationTypes.user_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.user_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.user_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.user_set](state, payload) {
    defaultEntryMutations.set(state.user, payload);
  },
  [MutationTypes.user_update](state, payload) {
    defaultEntryMutations.update(state.user, payload);
  },
  [MutationTypes.user_remove](state, payload) {
    defaultEntryMutations.remove(state.user, payload);
  },
};

export interface Getters {
  [GetterTypes.user_items](state: State): EntryItem[];
  [GetterTypes.user_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.user_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.user_items](state) {
    return state.user;
  },
  [GetterTypes.user_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.user, query);
    };
  },
  [GetterTypes.user_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.user, query);
    };
  },
};

export interface Actions {
  [ActionTypes.user_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.user_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.user_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.user_set]({ commit }, payload) {
    commit(MutationTypes.user_set, payload);
  },
  [ActionTypes.user_update]({ commit }, payload) {
    commit(MutationTypes.user_update, payload);
  },
  [ActionTypes.user_remove]({ commit }, payload) {
    commit(MutationTypes.user_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
