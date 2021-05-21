import { BCMSStatus } from '@becomes/cms-sdk/types';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
} from './enums';
import { BCMSStoreActionAugments, BCMSStoreState } from './main';

type EntryItem = BCMSStatus;

export interface BCMSStoreStatusMutations {
  [BCMSStoreMutationTypes.status_set](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.status_update](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.status_remove](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
}
export interface BCMSStoreStatusGetters {
  [BCMSStoreGetterTypes.status_items](state: BCMSStoreState): EntryItem[];
  [BCMSStoreGetterTypes.status_find](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [BCMSStoreGetterTypes.status_findOne](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
export interface BCMSStoreStatusActions {
  [BCMSStoreActionTypes.status_set](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem[]
  ): void;
  [BCMSStoreActionTypes.status_update](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreActionTypes.status_remove](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
