import type { BCMSMedia } from '@becomes/cms-sdk/types';
import type { BCMSMediaServicePrototype } from '../types';

export function BCMSMediaService(): BCMSMediaServicePrototype {
  return {
    async createFiles(parentId, files, uploadProgressCallback?) {
      const errors: Array<{
        filename: string;
        err: unknown;
      }> = [];
      const media: BCMSMedia[] = [];
      for (const i in files) {
        const file = files[i];
        try {
          const filenameParts = file.name.split('.');
          const filename =
            window.bcms.services.general.string.toUri(
              filenameParts.splice(0, filenameParts.length - 1).join('.')
            ) +
            '.' +
            filenameParts[filenameParts.length - 1];
          const fd = new FormData();
          fd.append('media', file, filename);
          const m = await window.bcms.sdk.media.addFile(
            fd,
            parentId,
            uploadProgressCallback
              ? (event: any) => {
                  console.log('uploadEvent', event);
                  uploadProgressCallback({
                    fileName: filename,
                    loaded: event.loaded,
                    total: event.total,
                  });
                }
              : undefined
          );
          media.push(m);
        } catch (error) {
          errors.push({
            filename: file.name,
            err: error,
          });
        }
      }
      return {
        media,
        errors,
      };
    },
  };
}
