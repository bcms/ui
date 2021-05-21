import { BCMSWidget } from '@becomes/cms-sdk/types';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
} from './enums';
import { BCMSStoreActionAugments, BCMSStoreState } from './main';

type EntryItem = BCMSWidget;

export interface BCMSStoreWidgetMutations {
  [BCMSStoreMutationTypes.widget_set](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.widget_update](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.widget_remove](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
}
export interface BCMSStoreWidgetGetters {
  [BCMSStoreGetterTypes.widget_items](state: BCMSStoreState): EntryItem[];
  [BCMSStoreGetterTypes.widget_find](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [BCMSStoreGetterTypes.widget_findOne](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
export interface BCMSStoreWidgetActions {
  [BCMSStoreActionTypes.widget_set](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem[]
  ): void;
  [BCMSStoreActionTypes.widget_update](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreActionTypes.widget_remove](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
