import { BCMSProp } from '@becomes/cms-sdk/types';

export type BCMSEntryLiteModified = {
  _id: string;
  createdAt: number;
  updatedAt: number;
  meta: {
    [lng: string]: BCMSProp[];
  };
  templateId: string;
  userId: string;
  status?: string;
};

export type BCMSEntryModified = BCMSEntryLiteModified & {
  content: {
    [lng: string]: BCMSProp[];
  };
};
