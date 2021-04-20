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
  instance(
    lite: boolean,
    languages: BCMSLanguage[],
    props: BCMSProp[]
  ): BCMSEntry | BCMSEntryLite;
  instanceModified(
    lite: boolean,
    languages: BCMSLanguage[],
    props: BCMSProp[]
  ): BCMSEntryModified | BCMSEntryLiteModified;
  liteToModified(entryLite: BCMSEntryLite): BCMSEntryLiteModified;
  toModified(entry: BCMSEntry): BCMSEntryModified;
  fromModified(entry: BCMSEntryModified): BCMSEntry;
  contentSection: {
    createPrimary(type: BCMSPropType): BCMSProp;
    createWidget(widget: BCMSWidget): BCMSProp;
  };
};
