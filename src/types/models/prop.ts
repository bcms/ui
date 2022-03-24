import {
  BCMSPropDateData,
  BCMSPropMediaData,
  BCMSPropType,
  BCMSPropValueEntryPointer,
  BCMSPropValueWidgetData,
} from '@becomes/cms-sdk/types';
import { JSONContent } from '@tiptap/core';

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
  | BCMSPropMediaData[]
  | BCMSPropValueWidgetData
  | BCMSPropValueExtendedRichTextData[];

export interface BCMSPropValueExtendedGroupPointerData {
  _id: string;
  items: Array<{
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
