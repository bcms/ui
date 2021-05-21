import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
  BCMSStoreState,
  BCMSStoreTemplateActions,
  BCMSStoreTemplateGetters,
  BCMSStoreTemplateMutations,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreTemplateMutations = {
  [BCMSStoreMutationTypes.template_set](state, payload) {
    defaultEntryMutations.set(state.template, payload);
  },
  [BCMSStoreMutationTypes.template_update](state, payload) {
    defaultEntryMutations.update(state.template, payload);
  },
  [BCMSStoreMutationTypes.template_remove](state, payload) {
    defaultEntryMutations.remove(state.template, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreTemplateGetters = {
  [BCMSStoreGetterTypes.template_items](state) {
    return state.template;
  },
  [BCMSStoreGetterTypes.template_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.template, query);
    };
  },
  [BCMSStoreGetterTypes.template_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.template, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreTemplateActions = {
  [BCMSStoreActionTypes.template_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.template_set, payload);
  },
  [BCMSStoreActionTypes.template_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.template_update, payload);
  },
  [BCMSStoreActionTypes.template_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.template_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
