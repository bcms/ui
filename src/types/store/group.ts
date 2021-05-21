import { BCMSGroup } from '@becomes/cms-sdk/types';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
} from './enums';
import { BCMSStoreActionAugments, BCMSStoreState } from './main';

type EntryItem = BCMSGroup;

export interface BCMSStoreGroupMutations {
  [BCMSStoreMutationTypes.group_set](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.group_update](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.group_remove](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
}
export interface BCMSStoreGroupGetters {
  [BCMSStoreGetterTypes.group_items](state: BCMSStoreState): EntryItem[];
  [BCMSStoreGetterTypes.group_find](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [BCMSStoreGetterTypes.group_findOne](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
export interface BCMSStoreGroupActions {
  [BCMSStoreActionTypes.group_set](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem[]
  ): void;
  [BCMSStoreActionTypes.group_update](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreActionTypes.group_remove](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
