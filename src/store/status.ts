import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
  BCMSStoreState,
  BCMSStoreStatusActions,
  BCMSStoreStatusGetters,
  BCMSStoreStatusMutations,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreStatusMutations = {
  [BCMSStoreMutationTypes.status_set](state, payload) {
    defaultEntryMutations.set(state.status, payload);
  },
  [BCMSStoreMutationTypes.status_update](state, payload) {
    defaultEntryMutations.update(state.status, payload);
  },
  [BCMSStoreMutationTypes.status_remove](state, payload) {
    defaultEntryMutations.remove(state.status, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreStatusGetters = {
  [BCMSStoreGetterTypes.status_items](state) {
    return state.status;
  },
  [BCMSStoreGetterTypes.status_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.status, query);
    };
  },
  [BCMSStoreGetterTypes.status_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.status, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreStatusActions = {
  [BCMSStoreActionTypes.status_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.status_set, payload);
  },
  [BCMSStoreActionTypes.status_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.status_update, payload);
  },
  [BCMSStoreActionTypes.status_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.status_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
