import {
  ActionAugments,
  ActionTypes,
  GetterTypes,
  MutationTypes,
  State,
} from '@/store/index';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from '@/store/_defaults';
import type { BCMSMedia } from '@becomes/cms-sdk/types';

type EntryItem = BCMSMedia;

export interface Mutations {
  [MutationTypes.media_set](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.media_update](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
  [MutationTypes.media_remove](
    state: State,
    payload: EntryItem | EntryItem[]
  ): void;
}
const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.media_set](state, payload) {
    defaultEntryMutations.set(state.media, payload);
  },
  [MutationTypes.media_update](state, payload) {
    defaultEntryMutations.update(state.media, payload);
  },
  [MutationTypes.media_remove](state, payload) {
    defaultEntryMutations.remove(state.media, payload);
  },
};

export interface Getters {
  [GetterTypes.media_items](state: State): EntryItem[];
  [GetterTypes.media_find](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [GetterTypes.media_findOne](
    state: State
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
const getters: GetterTree<State, State> & Getters = {
  [GetterTypes.media_items](state) {
    return state.media;
  },
  [GetterTypes.media_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.media, query);
    };
  },
  [GetterTypes.media_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.media, query);
    };
  },
};

export interface Actions {
  [ActionTypes.media_set](ctx: ActionAugments, payload: EntryItem[]): void;
  [ActionTypes.media_update](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [ActionTypes.media_remove](
    ctx: ActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.media_set]({ commit }, payload) {
    commit(MutationTypes.media_set, payload);
  },
  [ActionTypes.media_update]({ commit }, payload) {
    commit(MutationTypes.media_update, payload);
  },
  [ActionTypes.media_remove]({ commit }, payload) {
    commit(MutationTypes.media_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
