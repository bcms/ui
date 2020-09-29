import type { EntryLite, Prop } from '@becomes/cms-sdk';

export interface EntryLiteModifiedMeta {
  _id: string;
  createdAt: number;
  updatedAt: number;
  meta: {
    [lng: string]: Prop[];
  };
  templateId: string;
  userId: string;
}

export interface EntryModifiedMeta extends EntryLiteModifiedMeta {
  content?: any[];
}
