import type { Prop } from '@becomes/cms-sdk';

export interface EntryLiteModified {
  _id: string;
  createdAt: number;
  updatedAt: number;
  meta: {
    [lng: string]: Prop[];
  };
  templateId: string;
  userId: string;
}

export interface EntryModified extends EntryLiteModified {
  content?: {
    [lng: string]: Prop[];
  };
}
