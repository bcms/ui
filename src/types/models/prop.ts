import {
  BCMSPropDateData,
  BCMSPropMediaData,
  BCMSPropType,
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
  templateId?: string;
  groupId?: string;
  enumItems?: string[];
}
