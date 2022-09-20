import type {
  BCMSPropDateData,
  BCMSPropType,
  BCMSPropValueEntryPointer,
  BCMSPropValueMediaData,
  BCMSPropValueWidgetData,
} from '@becomes/cms-sdk/types';
import type { JSONContent } from '@tiptap/core';

export interface BCMSPropValueExtendedRichTextData {
  id: string;
  nodes: JSONContent[];
}

export type BCMSPropValueExtendedData =
  | string[]
  | boolean[]
  | number[]
  | BCMSPropDateData
  | BCMSPropValueExtendedGroupPointerData
  | BCMSPropValueEntryPointer[]
  | BCMSPropValueMediaData[]
  | BCMSPropValueWidgetData
  | BCMSPropValueExtendedRichTextData[];

export interface BCMSPropValueExtendedGroupPointerData {
  _id: string;
  items: Array<{
    id: string;
    props: BCMSPropValueExtended[];
  }>;
}

export interface BCMSPropValueExtended {
  id: string;
  data: BCMSPropValueExtendedData;
  label: string;
  required: boolean;
  array: boolean;
  type: BCMSPropType;
  templateIds?: string[];
  groupId?: string;
  enumItems?: string[];
}
