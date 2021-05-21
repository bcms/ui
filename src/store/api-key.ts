import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreApiKeyActions,
  BCMSStoreApiKeyGetters,
  BCMSStoreApiKeyMutations,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
  BCMSStoreState,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreApiKeyMutations = {
  [BCMSStoreMutationTypes.apiKey_set](state, payload) {
    defaultEntryMutations.set(state.apiKey, payload);
  },
  [BCMSStoreMutationTypes.apiKey_update](state, payload) {
    defaultEntryMutations.update(state.apiKey, payload);
  },
  [BCMSStoreMutationTypes.apiKey_remove](state, payload) {
    defaultEntryMutations.remove(state.apiKey, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreApiKeyGetters = {
  [BCMSStoreGetterTypes.apiKey_items](state) {
    return state.apiKey;
  },
  [BCMSStoreGetterTypes.apiKey_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.apiKey, query);
    };
  },
  [BCMSStoreGetterTypes.apiKey_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.apiKey, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreApiKeyActions = {
  [BCMSStoreActionTypes.apiKey_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.apiKey_set, payload);
  },
  [BCMSStoreActionTypes.apiKey_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.apiKey_update, payload);
  },
  [BCMSStoreActionTypes.apiKey_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.apiKey_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
