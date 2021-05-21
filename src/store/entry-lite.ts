import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreEntryLiteActions,
  BCMSStoreEntryLiteGetters,
  BCMSStoreEntryLiteMutations,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
  BCMSStoreState,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreEntryLiteMutations = {
  [BCMSStoreMutationTypes.entryLite_set](state, payload) {
    defaultEntryMutations.set(state.entryLite, payload);
  },
  [BCMSStoreMutationTypes.entryLite_update](state, payload) {
    defaultEntryMutations.update(state.entryLite, payload);
  },
  [BCMSStoreMutationTypes.entryLite_remove](state, payload) {
    defaultEntryMutations.remove(state.entryLite, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreEntryLiteGetters = {
  [BCMSStoreGetterTypes.entryLite_items](state) {
    return state.entryLite;
  },
  [BCMSStoreGetterTypes.entryLite_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.entryLite, query);
    };
  },
  [BCMSStoreGetterTypes.entryLite_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.entryLite, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreEntryLiteActions = {
  [BCMSStoreActionTypes.entryLite_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.entryLite_set, payload);
  },
  [BCMSStoreActionTypes.entryLite_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.entryLite_update, payload);
  },
  [BCMSStoreActionTypes.entryLite_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.entryLite_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
