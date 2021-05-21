import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreLanguageActions,
  BCMSStoreLanguageGetters,
  BCMSStoreLanguageMutations,
  BCMSStoreMutationTypes,
  BCMSStoreState,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreLanguageMutations = {
  [BCMSStoreMutationTypes.language_set](state, payload) {
    defaultEntryMutations.set(state.language, payload);
  },
  [BCMSStoreMutationTypes.language_update](state, payload) {
    defaultEntryMutations.update(state.language, payload);
  },
  [BCMSStoreMutationTypes.language_remove](state, payload) {
    defaultEntryMutations.remove(state.language, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreLanguageGetters = {
  [BCMSStoreGetterTypes.language_items](state) {
    return state.language;
  },
  [BCMSStoreGetterTypes.language_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.language, query);
    };
  },
  [BCMSStoreGetterTypes.language_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.language, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreLanguageActions = {
  [BCMSStoreActionTypes.language_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.language_set, payload);
  },
  [BCMSStoreActionTypes.language_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.language_update, payload);
  },
  [BCMSStoreActionTypes.language_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.language_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
