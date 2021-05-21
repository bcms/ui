import { BCMSLanguage } from '@becomes/cms-sdk/types';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
} from './enums';
import { BCMSStoreActionAugments, BCMSStoreState } from './main';

type EntryItem = BCMSLanguage;

export interface BCMSStoreLanguageMutations {
  [BCMSStoreMutationTypes.language_set](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.language_update](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.language_remove](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
}
export interface BCMSStoreLanguageGetters {
  [BCMSStoreGetterTypes.language_items](state: BCMSStoreState): EntryItem[];
  [BCMSStoreGetterTypes.language_find](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [BCMSStoreGetterTypes.language_findOne](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
export interface BCMSStoreLanguageActions {
  [BCMSStoreActionTypes.language_set](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem[]
  ): void;
  [BCMSStoreActionTypes.language_update](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreActionTypes.language_remove](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
