import type {
  BCMSEntry,
  BCMSEntryLite,
  BCMSLanguage,
  BCMSProp,
  BCMSPropType,
  BCMSWidget,
} from '@becomes/cms-sdk/types';
import { BCMSEntryLiteModified, BCMSEntryModified } from '../models';

export type BCMSEntryServicePrototype = {
  instance(languages: BCMSLanguage[], props: BCMSProp[]): BCMSEntry;
  instanceLite(languages: BCMSLanguage[], props: BCMSProp[]): BCMSEntryLite;
  instanceModified(
    languages: BCMSLanguage[],
    props: BCMSProp[]
  ): BCMSEntryModified;
  instanceLiteModified(
    languages: BCMSLanguage[],
    props: BCMSProp[]
  ): BCMSEntryLiteModified;
  toLiteModified(entryLite: BCMSEntryLite): BCMSEntryLiteModified;
  toModified(entry: BCMSEntry): BCMSEntryModified;
  fromModified(entry: BCMSEntryModified): BCMSEntry;
  contentSection: {
    createPrimary(type: BCMSPropType): BCMSProp;
    createWidget(widget: BCMSWidget): BCMSProp;
  };
};
