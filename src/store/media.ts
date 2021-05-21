import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMediaActions,
  BCMSStoreMediaGetters,
  BCMSStoreMediaMutations,
  BCMSStoreMutationTypes,
  BCMSStoreState,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreMediaMutations = {
  [BCMSStoreMutationTypes.media_set](state, payload) {
    defaultEntryMutations.set(state.media, payload);
  },
  [BCMSStoreMutationTypes.media_update](state, payload) {
    defaultEntryMutations.update(state.media, payload);
  },
  [BCMSStoreMutationTypes.media_remove](state, payload) {
    defaultEntryMutations.remove(state.media, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreMediaGetters = {
  [BCMSStoreGetterTypes.media_items](state) {
    return state.media;
  },
  [BCMSStoreGetterTypes.media_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.media, query);
    };
  },
  [BCMSStoreGetterTypes.media_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.media, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreMediaActions = {
  [BCMSStoreActionTypes.media_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.media_set, payload);
  },
  [BCMSStoreActionTypes.media_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.media_update, payload);
  },
  [BCMSStoreActionTypes.media_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.media_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
