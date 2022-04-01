import { BCMSEntity, BCMSWidget } from '@becomes/cms-sdk/types';
import { JSONContent } from '@tiptap/core';
import { BCMSPropValueExtended } from './prop';

export interface BCMSEntryExtended extends BCMSEntity {
  cid: string;
  templateId: string;
  userId: string;
  status?: string;
  meta: BCMSEntryExtendedMeta[];
  content: BCMSEntryExtendedContent[];
}

export interface BCMSEntryExtendedMeta {
  lng: string;
  props: BCMSPropValueExtended[];
}

export interface BCMSEntryExtendedContent {
  lng: string;
  nodes: JSONContent[];
}

export interface BCMSEntryExtendedContentAttrWidget {
  content: BCMSPropValueExtended[];
  widget?: BCMSWidget;
  class?: string;
}
