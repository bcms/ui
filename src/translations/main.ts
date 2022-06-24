import {
  apiErrorsApiKeyTranslationsEn,
  apiErrorsAuthTranslationsEn,
  apiErrorsBackupTranslationsEn,
  apiErrorsChangesTranslationsEn,
  apiErrorsColorTranslationsEn,
  apiErrorsTemplateTranslationsEn,
  apiErrorTemplateTranslationsResolved,
} from './api-errors';
import { inputTranslationsEn } from './input';
import { layoutTranslationsEn } from './layout';
import { modalTranslationsEn } from './modal';
import { pageTranslationsEn } from './pages';

type BCMSUILanguages = 'en' | 'de';

const EnTranslations = {
  modal: modalTranslationsEn,
  layout: layoutTranslationsEn,
  page: pageTranslationsEn,
  input: inputTranslationsEn,
  apiError: {
    ...apiErrorsApiKeyTranslationsEn,
    ...apiErrorsAuthTranslationsEn,
    ...apiErrorsBackupTranslationsEn,
    ...apiErrorsChangesTranslationsEn,
    ...apiErrorsColorTranslationsEn,
    ...apiErrorsTemplateTranslationsEn,
  },
};
type TranslationsType = typeof EnTranslations;

const Root: {
  [lng: string]: any;
} = {
  en: EnTranslations,
};

export function useTranslation(): TranslationsType {
  const lng: BCMSUILanguages = 'en';
  return Root[lng || 'en'];
}

export function apiErrorTranslation(
  code: string,
  originalMessage: string
): string | null {
  if (code.startsWith('tmp')) {
    return apiErrorTemplateTranslationsResolved(code, originalMessage);
  }

  return null;
}
