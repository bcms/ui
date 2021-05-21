import {
  BCMSApiKey,
  BCMSEntry,
  BCMSEntryLite,
  BCMSGroup,
  BCMSLanguage,
  BCMSMedia,
  BCMSStatus,
  BCMSTemplate,
  BCMSUser,
  BCMSWidget,
} from '@becomes/cms-sdk/types';
import {
  ActionContext,
  CommitOptions,
  DispatchOptions,
  Store as VuexStore,
} from 'vuex';
import {
  BCMSStoreTemplateActions,
  BCMSStoreTemplateGetters,
  BCMSStoreTemplateMutations,
} from './template';
import {
  BCMSStoreGroupActions,
  BCMSStoreGroupGetters,
  BCMSStoreGroupMutations,
} from './group';
import {
  BCMSStoreWidgetActions,
  BCMSStoreWidgetGetters,
  BCMSStoreWidgetMutations,
} from './widget';
import {
  BCMSStoreLanguageActions,
  BCMSStoreLanguageGetters,
  BCMSStoreLanguageMutations,
} from './language';
import {
  BCMSStoreUserActions,
  BCMSStoreUserGetters,
  BCMSStoreUserMutations,
} from './user';
import {
  BCMSStoreApiKeyActions,
  BCMSStoreApiKeyGetters,
  BCMSStoreApiKeyMutations,
} from './api-key';
import {
  BCMSStoreMediaActions,
  BCMSStoreMediaGetters,
  BCMSStoreMediaMutations,
} from './media';
import {
  BCMSStoreEntryActions,
  BCMSStoreEntryGetters,
  BCMSStoreEntryMutations,
} from './entry';
import {
  BCMSStoreEntryLiteActions,
  BCMSStoreEntryLiteGetters,
  BCMSStoreEntryLiteMutations,
} from './entry-lite';
import {
  BCMSStoreStatusActions,
  BCMSStoreStatusGetters,
  BCMSStoreStatusMutations,
} from './status';

export interface BCMSStoreState {
  template: BCMSTemplate[];
  group: BCMSGroup[];
  widget: BCMSWidget[];
  language: BCMSLanguage[];
  user: BCMSUser[];
  apiKey: BCMSApiKey[];
  media: BCMSMedia[];
  entry: BCMSEntry[];
  entryLite: BCMSEntryLite[];
  status: BCMSStatus[];
}
export type BCMSStoreMutations = BCMSStoreTemplateMutations &
  BCMSStoreGroupMutations &
  BCMSStoreWidgetMutations &
  BCMSStoreLanguageMutations &
  BCMSStoreUserMutations &
  BCMSStoreApiKeyMutations &
  BCMSStoreMediaMutations &
  BCMSStoreEntryMutations &
  BCMSStoreEntryLiteMutations &
  BCMSStoreStatusMutations;
export type BCMSStoreGetters = BCMSStoreTemplateGetters &
  BCMSStoreGroupGetters &
  BCMSStoreWidgetGetters &
  BCMSStoreLanguageGetters &
  BCMSStoreUserGetters &
  BCMSStoreApiKeyGetters &
  BCMSStoreMediaGetters &
  BCMSStoreEntryGetters &
  BCMSStoreEntryLiteGetters &
  BCMSStoreStatusGetters;
export type BCMSStoreActionAugments = Omit<
  ActionContext<BCMSStoreState, BCMSStoreState>,
  'commit'
> & {
  commit<K extends keyof BCMSStoreMutations>(
    key: K,
    payload: Parameters<BCMSStoreMutations[K]>[1]
  ): ReturnType<BCMSStoreMutations[K]>;
};
export type BCMSStoreActions = BCMSStoreTemplateActions &
  BCMSStoreGroupActions &
  BCMSStoreWidgetActions &
  BCMSStoreLanguageActions &
  BCMSStoreUserActions &
  BCMSStoreApiKeyActions &
  BCMSStoreMediaActions &
  BCMSStoreEntryActions &
  BCMSStoreEntryLiteActions &
  BCMSStoreStatusActions;
export type BCMSStore = Omit<
  VuexStore<BCMSStoreState>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<
    K extends keyof BCMSStoreMutations,
    P extends Parameters<BCMSStoreMutations[K]>[1]
  >(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<BCMSStoreMutations[K]>;
} & {
  dispatch<K extends keyof BCMSStoreActions>(
    key: K,
    payload?: Parameters<BCMSStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<BCMSStoreActions[K]>;
} & {
  getters: {
    [K in keyof BCMSStoreGetters]: ReturnType<BCMSStoreGetters[K]>;
  };
};
