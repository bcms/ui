import { GeneralService } from './general';
import { sdk } from './sdk';

export interface MediaServicePrototype {
  createFiles(
    parentId: string,
    name: string,
    files: File[],
    uploadProgressCallback?: (filename: string, event: any) => void
  ): Promise<
    Array<{
      filename: string;
      err: any;
    }>
  >;
}

function mediaService(): MediaServicePrototype {
  return {
    async createFiles(parentId, name, files, uploadProgressCallback) {
      const errors: Array<{
        filename: string;
        err: any;
      }> = [];
      for (const i in files) {
        const file = files[i];
        try {
          const filenameParts = file.name.split('.');
          const filename =
            GeneralService.string.toUri(
              filenameParts.splice(0, filenameParts.length - 1).join('.')
            ) +
            '.' +
            filenameParts[filenameParts.length - 1];
          const fd = new FormData();
          fd.append('media', file, filename);
          await sdk.media.addFile(fd, parentId, (event) => {
            if (uploadProgressCallback) {
              uploadProgressCallback(filename, event)
            }
          });
        } catch (error) {
          errors.push({
            filename: file.name,
            err: error,
          });
        }
      }
      return errors;
    },
  };
}

export const MediaService = mediaService();
