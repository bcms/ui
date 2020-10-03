import type { Prop } from '@becomes/cms-sdk';

export type EntryLiteModified = {
  _id: string;
  createdAt: number;
  updatedAt: number;
  meta: {
    [lng: string]: Prop[];
  };
  templateId: string;
  userId: string;
};

export type EntryModified = EntryLiteModified & {
  content?: {
    [lng: string]: Prop[];
  };
};
