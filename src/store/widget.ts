import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { defaultEntryGetters, defaultEntryMutations } from './_defaults';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
  BCMSStoreState,
  BCMSStoreWidgetActions,
  BCMSStoreWidgetGetters,
  BCMSStoreWidgetMutations,
} from '../types';

const mutations: MutationTree<BCMSStoreState> & BCMSStoreWidgetMutations = {
  [BCMSStoreMutationTypes.widget_set](state, payload) {
    defaultEntryMutations.set(state.widget, payload);
  },
  [BCMSStoreMutationTypes.widget_update](state, payload) {
    defaultEntryMutations.update(state.widget, payload);
  },
  [BCMSStoreMutationTypes.widget_remove](state, payload) {
    defaultEntryMutations.remove(state.widget, payload);
  },
};
const getters: GetterTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreWidgetGetters = {
  [BCMSStoreGetterTypes.widget_items](state) {
    return state.widget;
  },
  [BCMSStoreGetterTypes.widget_find](state) {
    return (query) => {
      return defaultEntryGetters.find(state.widget, query);
    };
  },
  [BCMSStoreGetterTypes.widget_findOne](state) {
    return (query) => {
      return defaultEntryGetters.findOne(state.widget, query);
    };
  },
};
const actions: ActionTree<BCMSStoreState, BCMSStoreState> &
  BCMSStoreWidgetActions = {
  [BCMSStoreActionTypes.widget_set]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.widget_set, payload);
  },
  [BCMSStoreActionTypes.widget_update]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.widget_update, payload);
  },
  [BCMSStoreActionTypes.widget_remove]({ commit }, payload) {
    commit(BCMSStoreMutationTypes.widget_remove, payload);
  },
};

export const store = {
  mutations,
  getters,
  actions,
};
