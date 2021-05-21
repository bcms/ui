import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreEntryActions,
  BCMSStoreEntryGetters,
  BCMSStoreEntryMutations,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
  BCMSStoreState,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreEntryMutations = {
  [BCMSStoreMutationTypes.entry_set](state, payload) {
    defaultEntryMutations.set(state.entry, payload);
  },
  [BCMSStoreMutationTypes.entry_update](state, payload) {
    defaultEntryMutations.update(state.entry, payload);
  },
  [BCMSStoreMutationTypes.entry_remove](state, payload) {
    defaultEntryMutations.remove(state.entry, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreEntryGetters = {
  [BCMSStoreGetterTypes.entry_items](state) {
    return state.entry;
  },
  [BCMSStoreGetterTypes.entry_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.entry, query);
    };
  },
  [BCMSStoreGetterTypes.entry_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.entry, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreEntryActions = {
  [BCMSStoreActionTypes.entry_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.entry_set, payload);
  },
  [BCMSStoreActionTypes.entry_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.entry_update, payload);
  },
  [BCMSStoreActionTypes.entry_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.entry_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
