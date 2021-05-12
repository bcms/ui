import type { BCMSMedia } from '@becomes/cms-sdk/types';

export interface BCMSMediaServicePrototype {
  createFiles(
    parentId: string,
    files: File[],
    uploadProgressCallback?: (data: {
      fileName: string;
      loaded: number;
      total: number;
    }) => void
  ): Promise<{
    media: BCMSMedia[];
    errors: Array<{
      filename: string;
      err: unknown;
    }>;
  }>;
}
