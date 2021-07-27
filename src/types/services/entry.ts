import type {
  BCMSEntry,
  BCMSEntryContentNode,
  BCMSTemplate,
} from '@becomes/cms-sdk/types';
import { JSONContent } from '@tiptap/core';
import { BCMSEntryExtended } from '../models';

export type BCMSEntryService = {
  toExtended(data: {
    template: string | BCMSTemplate;
    entry?: BCMSEntry;
  }): Promise<BCMSEntryExtended | null>;
  fromExtended(data: { extended: BCMSEntryExtended }): BCMSEntry;
  content: {
    toExtendedNodes(data: {
      contentNodes: BCMSEntryContentNode[];
    }): Promise<JSONContent[]>;
    fromExtendedNodes(data: {
      tContent: JSONContent[];
    }): BCMSEntryContentNode[];
  };
  // instanceLite(languages: BCMSLanguage[], props: BCMSProp[]): BCMSEntryLite;
  // instanceModified(
  //   languages: BCMSLanguage[],
  //   props: BCMSProp[]
  // ): BCMSEntryModified;
  // instanceLiteModified(
  //   languages: BCMSLanguage[],
  //   props: BCMSProp[]
  // ): BCMSEntryLiteModified;
  // toLiteModified(entryLite: BCMSEntryLite): BCMSEntryLiteModified;
  // toModified(entry: BCMSEntry): BCMSEntryModified;
  // fromModified(entry: BCMSEntryModified): BCMSEntry;
  // contentSection: {
  //   createPrimary(type: BCMSPropType): BCMSProp;
  //   createWidget(widget: BCMSWidget): BCMSProp;
  // };
};
