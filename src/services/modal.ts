import type { UppyFile } from '@uppy/core';
import { StoreService } from './store';

export interface ModalServicePrototype {
  open: {
    mediaUploader(config: {
      onDone: (files: UppyFile[]) => Promise<void>;
      onCancel?: () => Promise<void>;
    }): void;
  };
}

function modalService() {
  const self: ModalServicePrototype = {
    open: {
      mediaUploader(config) {
        StoreService.update('MediaUploaderModal', {
          show: true,
          onDone: config.onDone,
          onCancel: config.onCancel,
        });
      },
    },
  };
  return self;
}

export const ModalService = modalService();
