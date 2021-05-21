import { BCMSTemplate } from '@becomes/cms-sdk/types';
import {
  BCMSStoreActionTypes,
  BCMSStoreGetterTypes,
  BCMSStoreMutationTypes,
} from './enums';
import { BCMSStoreActionAugments, BCMSStoreState } from './main';

type EntryItem = BCMSTemplate;

export interface BCMSStoreTemplateMutations {
  [BCMSStoreMutationTypes.template_set](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.template_update](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreMutationTypes.template_remove](
    state: BCMSStoreState,
    payload: EntryItem | EntryItem[]
  ): void;
}
export interface BCMSStoreTemplateGetters {
  [BCMSStoreGetterTypes.template_items](state: BCMSStoreState): EntryItem[];
  [BCMSStoreGetterTypes.template_find](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem[];
  [BCMSStoreGetterTypes.template_findOne](
    state: BCMSStoreState
  ): (query: (item: EntryItem) => boolean) => EntryItem | undefined;
}
export interface BCMSStoreTemplateActions {
  [BCMSStoreActionTypes.template_set](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem[]
  ): void;
  [BCMSStoreActionTypes.template_update](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
  [BCMSStoreActionTypes.template_remove](
    ctx: BCMSStoreActionAugments,
    payload: EntryItem | EntryItem[]
  ): void;
}
