import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreGroupActions,
  BCMSStoreGroupGetters,
  BCMSStoreGroupMutations,
  BCMSStoreMutationTypes,
  BCMSStoreState,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreGroupMutations = {
  [BCMSStoreMutationTypes.group_set](state, payload) {
    defaultEntryMutations.set(state.group, payload);
  },
  [BCMSStoreMutationTypes.group_update](state, payload) {
    defaultEntryMutations.update(state.group, payload);
  },
  [BCMSStoreMutationTypes.group_remove](state, payload) {
    defaultEntryMutations.remove(state.group, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreGroupGetters = {
  [BCMSStoreGetterTypes.group_items](state) {
    return state.group;
  },
  [BCMSStoreGetterTypes.group_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.group, query);
    };
  },
  [BCMSStoreGetterTypes.group_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.group, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreGroupActions = {
  [BCMSStoreActionTypes.group_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.group_set, payload);
  },
  [BCMSStoreActionTypes.group_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.group_update, payload);
  },
  [BCMSStoreActionTypes.group_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.group_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
