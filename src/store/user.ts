import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
  BCMSStoreState,
  BCMSStoreUserActions,
  BCMSStoreUserGetters,
  BCMSStoreUserMutations,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreUserMutations = {
  [BCMSStoreMutationTypes.user_set](state, payload) {
    defaultEntryMutations.set(state.user, payload);
  },
  [BCMSStoreMutationTypes.user_update](state, payload) {
    defaultEntryMutations.update(state.user, payload);
  },
  [BCMSStoreMutationTypes.user_remove](state, payload) {
    defaultEntryMutations.remove(state.user, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreUserGetters = {
  [BCMSStoreGetterTypes.user_items](state) {
    return state.user;
  },
  [BCMSStoreGetterTypes.user_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.user, query);
    };
  },
  [BCMSStoreGetterTypes.user_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.user, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreUserActions = {
  [BCMSStoreActionTypes.user_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.user_set, payload);
  },
  [BCMSStoreActionTypes.user_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.user_update, payload);
  },
  [BCMSStoreActionTypes.user_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.user_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
