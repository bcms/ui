import { StoreService } from './store';

export interface ConfirmServicePrototype {
  confirm(title: string, text: string): Promise<boolean>;
}

function confirmService() {
  const self: ConfirmServicePrototype = {
    async confirm(title, text) {
      return new Promise<boolean>((resolve) => {
        StoreService.update('ConfirmModal', {
          show: true,
          title,
          body: text,
          callback: (type: 'done' | 'cancel') => {
            resolve(type === 'done');
          },
        });
      });
    },
  };
  return self;
}

export const ConfirmService = confirmService();
